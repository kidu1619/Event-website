const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Vendor = require('../models/Vendor');
const Inspiration = require('../models/Inspiration');
const Review = require('../models/Review');

// Password security helpers using native Node crypto
function hashPassword(password) {
    if (!password) return '';
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    if (!stored || !password) return false;
    if (!stored.includes(':')) {
        return stored === password;
    }
    const [salt, key] = stored.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return key === hash;
}

// Security: Brute-force rate limiting and OTP store
const failedAttemptsMap = new Map(); // key -> { count: number, lockedUntil: timestamp }
const otpStoreMap = new Map();       // phone/id -> { code: string, expiresAt: timestamp }
const resetTokenMap = new Map();     // token -> { vendorId: string, expiresAt: timestamp }

function checkRateLimit(identifier) {
    if (!identifier) return { isLocked: false };
    const key = identifier.toLowerCase().trim();
    const entry = failedAttemptsMap.get(key);
    if (!entry) return { isLocked: false };
    if (Date.now() < entry.lockedUntil) {
        const remainingSeconds = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
        return { isLocked: true, remainingSeconds };
    }
    if (entry.lockedUntil && Date.now() >= entry.lockedUntil) {
        failedAttemptsMap.delete(key);
    }
    return { isLocked: false };
}

function recordFailedAttempt(identifier) {
    if (!identifier) return;
    const key = identifier.toLowerCase().trim();
    const entry = failedAttemptsMap.get(key) || { count: 0, lockedUntil: 0 };
    entry.count += 1;
    if (entry.count >= 5) {
        entry.lockedUntil = Date.now() + 5 * 60 * 1000; // 5 minute lock out
    }
    failedAttemptsMap.set(key, entry);
    return entry;
}

function clearFailedAttempts(identifier) {
    if (!identifier) return;
    failedAttemptsMap.delete(identifier.toLowerCase().trim());
}

// Bootstrap routine to ensure existing seeded vendors have usernames and default passwords
async function ensureVendorCredentials() {
    try {
        const vendors = await Vendor.find({});
        for (const v of vendors) {
            let updated = false;
            if (!v.username) {
                const baseName = (v.slug || v.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-').replace(/^-|-$/g, '');
                let candidate = baseName;
                const existing = await Vendor.findOne({ username: candidate, _id: { $ne: v._id } });
                if (existing) {
                    candidate = `${baseName}-${v._id.toString().slice(-4)}`;
                }
                v.username = candidate;
                updated = true;
            }
            if (!v.password) {
                v.password = hashPassword('vendor123');
                updated = true;
            }
            if (updated) {
                await v.save();
            }
            if (v.status === 'active') {
                await syncVendorToInspirationFeed(v);
            }
        }
    } catch (err) {
        console.error('Error syncing vendor credentials and inspirations:', err.message);
    }
}
setTimeout(ensureVendorCredentials, 1500);


// @route   GET /api/vendors
// @desc    Get all vendors with filtering (Category, subcategory, search, rating, status)
router.get('/', async (req, res) => {
    try {
        const { category, search, verified, sort, status } = req.query;
        let query = {};

        // Status filtering: if 'all', don't filter status; if specified, use it; default to active only
        if (status === 'all') {
            // return all vendors regardless of status
        } else if (status) {
            query.status = status;
        } else {
            // Default public view: exclude pending vendors
            query.status = { $ne: 'pending' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (verified === 'true') {
            query.isVerified = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { specialties: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        let sortOption = { rating: -1, completedEvents: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'events') sortOption = { completedEvents: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const vendors = await Vendor.find(query).sort(sortOption);
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/vendors/:id
// @desc    Get single vendor with full portfolio and reviews
router.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const inspirations = await Inspiration.find({ vendorId: vendor._id }).sort({ createdAt: -1 });
        const reviews = await Review.find({ vendorId: vendor._id }).sort({ createdAt: -1 });

        res.json({
            vendor,
            inspirations,
            reviews
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Helper to generate unique slug
const generateSlug = (name) => {
    const base = (name || 'vendor')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const rand = Math.random().toString(36).substring(2, 6);
    return `${base}-${rand}`;
};

// @route   POST /api/vendors/register
// @desc    Self-registration for new vendors
router.post('/register', async (req, res) => {
    try {
        const {
            name, category, subcategories, tagline, bio, location,
            contactPhone, contactEmail, instagram, telegram, website,
            priceRange, startingPrice, avatar, coverImage,
            portfolioImages, specialties, packages, experienceYears, completedEvents,
            username, password, isVerified, badge, status
        } = req.body;

        if (!name || !category || !contactPhone) {
            return res.status(400).json({ message: 'Business Name, Category, and Phone Number are required.' });
        }

        if (!password || password.trim().length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters.' });
        }

        let cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (!cleanUsername) {
            cleanUsername = (name || 'vendor').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        // Check if vendor already exists by username, phone or email
        const existing = await Vendor.findOne({
            $or: [
                { username: cleanUsername },
                { contactPhone: contactPhone.trim() },
                ...(contactEmail ? [{ contactEmail: contactEmail.trim().toLowerCase() }] : [])
            ]
        });

        if (existing) {
            if (existing.username === cleanUsername) {
                return res.status(409).json({
                    message: `The username "${cleanUsername}" is already taken. Please choose another username.`,
                    vendor: existing
                });
            }
            return res.status(409).json({
                message: 'A vendor with this phone number or email is already registered.',
                vendor: existing
            });
        }

        const newVendor = new Vendor({
            name: name.trim(),
            slug: generateSlug(name),
            username: cleanUsername,
            password: hashPassword(password || 'vendor123'),
            category,
            subcategories: Array.isArray(subcategories) ? subcategories : (subcategories ? subcategories.split(',').map(s => s.trim()) : []),
            tagline: tagline || '',
            bio: bio || '',
            location: location || 'Addis Ababa, Ethiopia',
            contactPhone: contactPhone.trim(),
            contactEmail: contactEmail ? contactEmail.trim().toLowerCase() : '',
            instagram: instagram || '',
            telegram: telegram || '',
            website: website || '',
            priceRange: priceRange || '$$$',
            startingPrice: startingPrice || '50,000 ETB',
            avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
            portfolioImages: Array.isArray(portfolioImages) ? portfolioImages.filter(Boolean) : (portfolioImages ? portfolioImages.split(',').map(s => s.trim()).filter(Boolean) : []),
            specialties: Array.isArray(specialties) ? specialties : (specialties ? specialties.split(',').map(s => s.trim()) : []),
            packages: Array.isArray(packages) ? packages : [],
            experienceYears: Number(experienceYears) || 3,
            completedEvents: Number(completedEvents) || 25,
            isVerified: isVerified !== undefined ? isVerified : false,
            badge: badge || (status === 'active' ? 'Admin Curated Elite' : 'Pending Review'),
            status: status || 'pending'
        });

        const saved = await newVendor.save();

        if (saved.status === 'active') {
            await syncVendorToInspirationFeed(saved);
        }

        res.status(201).json({
            message: saved.status === 'active' 
                ? 'Vendor onboarded and published to directory & inspiration feed!'
                : 'Vendor application submitted! Awaiting Admin verification before publishing.',
            vendor: saved
        });
    } catch (err) {
        console.error('Error registering vendor:', err);
        res.status(400).json({ message: 'Error registering vendor', error: err.message });
    }
});

// Helper to automatically publish approved vendor's portfolio/cover visuals to the Inspiration feed
async function syncVendorToInspirationFeed(vendor) {
    if (!vendor || vendor.status !== 'active') return [];

    const candidateImages = [];
    if (Array.isArray(vendor.portfolioImages)) {
        vendor.portfolioImages.forEach(img => {
            if (img && typeof img === 'string' && img.trim() && !candidateImages.includes(img.trim())) {
                candidateImages.push(img.trim());
            }
        });
    }
    if (vendor.coverImage && typeof vendor.coverImage === 'string' && vendor.coverImage.trim() && !candidateImages.includes(vendor.coverImage.trim())) {
        candidateImages.push(vendor.coverImage.trim());
    }

    // Default high-res fallback if no images provided
    if (candidateImages.length === 0) {
        candidateImages.push(
            vendor.category === 'Media'
                ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
        );
    }

    const createdInspirations = [];
    const validCategories = ['Decor', 'Media', 'Floral Art', 'Lighting & Stage', 'Traditional', 'Modern Luxury'];
    const primaryCat = validCategories.includes(vendor.category) ? vendor.category : 'Decor';

    for (let i = 0; i < candidateImages.length; i++) {
        const imgUrl = candidateImages[i];
        
        // Avoid duplicate inspirations for this specific vendor and image
        const existing = await Inspiration.findOne({ vendorId: vendor._id, imageUrl: imgUrl });
        if (!existing) {
            const specialty = (vendor.specialties && vendor.specialties.length > 0)
                ? vendor.specialties[i % vendor.specialties.length]
                : (vendor.category === 'Decor' ? 'Luxury Stage & Scenography' : 'Cinematic Visual Portfolio');

            const isTraditional = (vendor.specialties && vendor.specialties.some(s => /traditional|melse/i.test(s))) ||
                                  /traditional|melse/i.test(vendor.tagline || '') ||
                                  /traditional|melse/i.test(vendor.bio || '');

            const eventType = isTraditional && i % 2 === 0
                ? 'Traditional Melse'
                : (i === 1 ? 'Corporate Gala' : 'Modern Wedding');

            const newInsp = new Inspiration({
                title: `${vendor.name} • ${specialty}`,
                description: vendor.bio || vendor.tagline || `Curated ${vendor.category} installation designed and executed by ${vendor.name}.`,
                imageUrl: imgUrl,
                category: isTraditional && i % 2 === 0 ? 'Traditional' : primaryCat,
                subCategory: specialty,
                eventType: eventType,
                vendorId: vendor._id,
                palette: primaryCat === 'Media' 
                    ? ['#12151B', '#D4AF37', '#EAD5B5', '#836547']
                    : ['#D4AF37', '#FAF5EC', '#1C1917', '#EAD5B5', '#9E7A1B'],
                tags: [primaryCat, specialty, 'Admin Curated', 'Verified Creator', vendor.location || 'Addis Ababa'].filter(Boolean),
                location: vendor.location || 'Addis Ababa',
                featured: i === 0,
                likesCount: Math.floor(Math.random() * 12) + 3
            });

            const savedInsp = await newInsp.save();
            createdInspirations.push(savedInsp);
        }
    }
    return createdInspirations;
}

// @route   PATCH /api/vendors/:id/approve
// @desc    Admin approves and publishes a vendor to Curated Vendors & Inspiration Feed
router.patch('/:id/approve', async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { status: 'active', isVerified: true, badge: 'Admin Curated Elite' },
            { new: true }
        );
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        // Automatically publish approved vendor's portfolio/cover to Inspiration Feed
        const newInspirations = await syncVendorToInspirationFeed(vendor);

        res.json({ 
            message: `Vendor "${vendor.name}" approved! Published to Curated Vendors and created ${newInspirations.length} new inspiration item(s) in feed.`, 
            vendor,
            newInspirationsCount: newInspirations.length,
            newInspirations
        });
    } catch (err) {
        console.error('Error approving vendor:', err);
        res.status(500).json({ message: 'Error approving vendor', error: err.message });
    }
});

// @route   POST /api/vendors/sync-all-inspirations
// @desc    Ensure all approved vendors have their work in the Inspiration Feed
router.post('/sync-all-inspirations', async (req, res) => {
    try {
        const activeVendors = await Vendor.find({ status: 'active' });
        let totalCreated = 0;
        for (const v of activeVendors) {
            const created = await syncVendorToInspirationFeed(v);
            totalCreated += created.length;
        }
        res.json({ message: `Successfully synchronized inspiration feed! Added ${totalCreated} new inspiration(s).`, totalCreated });
    } catch (err) {
        res.status(500).json({ message: 'Error synchronizing inspiration feed', error: err.message });
    }
});

// @route   PATCH /api/vendors/:id/status
// @desc    Admin updates vendor status (active, pending, inactive)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, isVerified, badge } = req.body;
        const updateData = {};
        if (status) updateData.status = status;
        if (isVerified !== undefined) updateData.isVerified = isVerified;
        if (badge) updateData.badge = badge;

        const vendor = await Vendor.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        if (vendor.status === 'active') {
            await syncVendorToInspirationFeed(vendor);
        }

        res.json({ message: `Vendor status updated to ${status}`, vendor });
    } catch (err) {
        res.status(500).json({ message: 'Error updating vendor status', error: err.message });
    }
});

// Helper to extract numeric phone digits for flexible matching
function extractPhoneDigits(phone) {
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/\D/g, '');
}

// @route   POST /api/vendors/login
// @desc    Sign in vendor using username/email/phone and password
router.post('/login', async (req, res) => {
    try {
        const { username, password, identifier } = req.body;
        const loginId = (username || identifier || '').trim();
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';

        if (!loginId) {
            return res.status(400).json({ message: 'Please enter your username, email, or phone number.' });
        }
        if (!password || !password.trim()) {
            return res.status(400).json({ message: 'Please enter your password.' });
        }

        const rateCheckId = checkRateLimit(loginId);
        const rateCheckIp = checkRateLimit(clientIp);
        if (rateCheckId.isLocked || rateCheckIp.isLocked) {
            const remaining = rateCheckId.isLocked ? rateCheckId.remainingSeconds : rateCheckIp.remainingSeconds;
            return res.status(429).json({
                message: `Too many failed sign-in attempts. Account temporarily locked for security. Please try again in ${remaining}s or use Phone OTP / Forgot Password.`,
                locked: true,
                remainingSeconds: remaining
            });
        }

        const trimmedId = loginId.trim();
        const escaped = trimmedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const digits = extractPhoneDigits(trimmedId);
        const last9 = digits.length >= 7 ? digits.slice(-9) : null;

        let vendor = await Vendor.findOne({
            $or: [
                { username: trimmedId.toLowerCase() },
                { slug: trimmedId.toLowerCase() },
                { contactEmail: trimmedId.toLowerCase() },
                { contactPhone: trimmedId },
                { name: { $regex: `^${escaped}$`, $options: 'i' } }
            ]
        });

        if (!vendor && last9) {
            const allVendors = await Vendor.find({});
            vendor = allVendors.find(v => {
                const vDigits = extractPhoneDigits(v.contactPhone);
                return vDigits && vDigits.endsWith(last9);
            });
        }

        if (!vendor) {
            return res.status(404).json({ message: 'No registered vendor found matching that username or email.' });
        }

        // Lazy initialize default password for existing seeded records if not yet set
        if (!vendor.password) {
            vendor.password = hashPassword('vendor123');
            if (!vendor.username) {
                vendor.username = vendor.slug || trimmedId.toLowerCase();
            }
            await vendor.save();
        }

        const isMatch = verifyPassword(password.trim(), vendor.password);
        if (!isMatch) {
            const attemptInfo = recordFailedAttempt(loginId);
            if (clientIp) recordFailedAttempt(clientIp);
            const remaining = Math.max(0, 5 - (attemptInfo.count % 5));
            if (attemptInfo.count >= 5 && attemptInfo.lockedUntil > Date.now()) {
                return res.status(429).json({
                    message: 'Too many failed sign-in attempts. Account locked for 5 minutes. You may use Phone OTP or Forgot Password to recover.',
                    locked: true,
                    remainingSeconds: 300
                });
            }
            return res.status(401).json({
                message: `Incorrect password. ${remaining} attempt(s) remaining before security lockout.`
            });
        }

        clearFailedAttempts(loginId);
        if (clientIp) clearFailedAttempts(clientIp);
        if (vendor.username) clearFailedAttempts(vendor.username);
        if (vendor.contactPhone) clearFailedAttempts(vendor.contactPhone);

        const vendorObj = vendor.toObject();
        delete vendorObj.password;

        res.json({
            message: 'Signed in successfully!',
            vendor: vendorObj
        });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
});

// @route   POST /api/vendors/forgot-password
// @desc    Initiate self-service password recovery by username, phone or email
router.post('/forgot-password', async (req, res) => {
    try {
        const { identifier } = req.body;
        if (!identifier || !identifier.trim()) {
            return res.status(400).json({ message: 'Please provide your registered username, phone, or email.' });
        }
        const trimmed = identifier.trim();
        const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const digits = extractPhoneDigits(trimmed);
        const last9 = digits.length >= 7 ? digits.slice(-9) : null;

        let vendor = await Vendor.findOne({
            $or: [
                { username: trimmed.toLowerCase() },
                { contactEmail: trimmed.toLowerCase() },
                { contactPhone: trimmed },
                { name: { $regex: `^${escaped}$`, $options: 'i' } }
            ]
        });

        if (!vendor && last9) {
            const allVendors = await Vendor.find({});
            vendor = allVendors.find(v => {
                const vDigits = extractPhoneDigits(v.contactPhone);
                return vDigits && vDigits.endsWith(last9);
            });
        }

        if (!vendor) {
            return res.status(404).json({ message: 'No registered vendor found with those details.' });
        }

        const recoveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        resetTokenMap.set(resetToken, { 
            vendorId: vendor._id.toString(), 
            expiresAt: Date.now() + 15 * 60 * 1000,
            otp: recoveryOtp 
        });

        if (vendor.contactPhone) {
            otpStoreMap.set(vendor.contactPhone, { 
                code: recoveryOtp, 
                expiresAt: Date.now() + 15 * 60 * 1000, 
                vendorId: vendor._id 
            });
        }

        const phoneMasked = vendor.contactPhone
            ? vendor.contactPhone.slice(0, 4) + ' ••• ' + vendor.contactPhone.slice(-3)
            : 'Phone on file';

        res.json({
            message: `Account located for "${vendor.name}". You can now set your new password.`,
            vendorName: vendor.name,
            username: vendor.username,
            phoneMasked,
            resetToken,
            recoveryOtp,
            demoOtp: recoveryOtp
        });
    } catch (err) {
        res.status(500).json({ message: 'Forgot password error', error: err.message });
    }
});

// @route   POST /api/vendors/reset-password
// @desc    Reset vendor password using reset token, otp or identifier
router.post('/reset-password', async (req, res) => {
    try {
        const { identifier, resetToken, otp, newPassword } = req.body;

        if (!newPassword || newPassword.trim().length < 4) {
            return res.status(400).json({ message: 'New password must be at least 4 characters.' });
        }

        let vendor = null;

        if (resetToken && resetTokenMap.has(resetToken)) {
            const tokenData = resetTokenMap.get(resetToken);
            if (Date.now() <= tokenData.expiresAt) {
                vendor = await Vendor.findById(tokenData.vendorId);
                resetTokenMap.delete(resetToken);
            }
        }

        if (!vendor && otp) {
            for (const [phoneKey, stored] of otpStoreMap.entries()) {
                if (stored.code === String(otp).trim() && Date.now() <= stored.expiresAt) {
                    vendor = await Vendor.findById(stored.vendorId);
                    otpStoreMap.delete(phoneKey);
                    break;
                }
            }
        }

        if (!vendor && identifier) {
            const trimmed = identifier.trim();
            const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const digits = extractPhoneDigits(trimmed);
            const last9 = digits.length >= 7 ? digits.slice(-9) : null;

            vendor = await Vendor.findOne({
                $or: [
                    { username: trimmed.toLowerCase() },
                    { contactEmail: trimmed.toLowerCase() },
                    { contactPhone: trimmed },
                    { name: { $regex: `^${escaped}$`, $options: 'i' } }
                ]
            });

            if (!vendor && last9) {
                const allVendors = await Vendor.find({});
                vendor = allVendors.find(v => {
                    const vDigits = extractPhoneDigits(v.contactPhone);
                    return vDigits && vDigits.endsWith(last9);
                });
            }
        }

        if (!vendor) {
            return res.status(400).json({ message: 'Password reset session expired or vendor not found. Please try again.' });
        }

        vendor.password = hashPassword(newPassword.trim());
        await vendor.save();

        clearFailedAttempts(vendor.username || '');
        clearFailedAttempts(vendor.contactPhone || '');
        if (vendor.contactEmail) clearFailedAttempts(vendor.contactEmail);
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        if (clientIp) clearFailedAttempts(clientIp);

        const vendorObj = vendor.toObject();
        delete vendorObj.password;

        res.json({
            message: 'Password successfully updated! You are now signed in.',
            vendor: vendorObj
        });
    } catch (err) {
        res.status(500).json({ message: 'Password reset error', error: err.message });
    }
});

// @route   POST /api/vendors/otp-request
// @desc    Send 4-digit SMS verification code to vendor phone
router.post('/otp-request', async (req, res) => {
    try {
        const phone = req.body.phone || req.body.phoneNumber;
        if (!phone || !phone.trim()) {
            return res.status(400).json({ message: 'Please enter your registered phone number.' });
        }
        const cleanPhone = phone.trim();
        const digits = extractPhoneDigits(cleanPhone);
        const last9 = digits.length >= 7 ? digits.slice(-9) : null;

        let vendor = await Vendor.findOne({ contactPhone: cleanPhone });

        if (!vendor && last9) {
            const allVendors = await Vendor.find({});
            vendor = allVendors.find(v => {
                const vDigits = extractPhoneDigits(v.contactPhone);
                return vDigits && vDigits.endsWith(last9);
            });
        }

        if (!vendor) {
            return res.status(404).json({ message: 'No registered vendor found matching this phone number.' });
        }

        // Generate 4-digit code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const expiry = Date.now() + 10 * 60 * 1000;
        otpStoreMap.set(vendor.contactPhone, { code, expiresAt: expiry, vendorId: vendor._id });
        if (cleanPhone !== vendor.contactPhone) {
            otpStoreMap.set(cleanPhone, { code, expiresAt: expiry, vendorId: vendor._id });
        }

        res.json({
            message: `One-time sign in code sent to ${vendor.contactPhone}!`,
            phone: vendor.contactPhone,
            demoOtp: code,
            vendorName: vendor.name
        });
    } catch (err) {
        res.status(500).json({ message: 'OTP request error', error: err.message });
    }
});

// @route   POST /api/vendors/otp-verify
// @desc    Sign in vendor using verified phone OTP
router.post('/otp-verify', async (req, res) => {
    try {
        const phone = req.body.phone || req.body.phoneNumber;
        const { otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone number and verification code are required.' });
        }

        const cleanPhone = phone.trim();
        const digits = extractPhoneDigits(cleanPhone);
        const last9 = digits.length >= 7 ? digits.slice(-9) : null;

        let stored = otpStoreMap.get(cleanPhone);
        if (!stored && last9) {
            for (const [key, val] of otpStoreMap.entries()) {
                const kDigits = extractPhoneDigits(key);
                if (kDigits && kDigits.endsWith(last9)) {
                    stored = val;
                    otpStoreMap.delete(key);
                    break;
                }
            }
        }

        if (!stored || Date.now() > stored.expiresAt || stored.code !== String(otp).trim()) {
            return res.status(401).json({ message: 'Invalid or expired verification code. Please request a new code.' });
        }

        const vendor = await Vendor.findById(stored.vendorId);
        otpStoreMap.delete(cleanPhone);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor account not found.' });
        }

        clearFailedAttempts(cleanPhone);
        if (vendor.username) clearFailedAttempts(vendor.username);
        if (vendor.contactPhone) clearFailedAttempts(vendor.contactPhone);
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
        if (clientIp) clearFailedAttempts(clientIp);

        const vendorObj = vendor.toObject();
        delete vendorObj.password;

        res.json({
            message: `Welcome back, ${vendor.name}! Verified via secure Phone OTP.`,
            vendor: vendorObj
        });
    } catch (err) {
        res.status(500).json({ message: 'OTP verification error', error: err.message });
    }
});

// @route   POST /api/vendors/:id/portfolio
// @desc    Add image URL to vendor's portfolio & sync to inspiration feed
router.post('/:id/portfolio', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: 'Image URL is required' });

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        // Enforce admin approval requirement: only active approved vendors can publish additional works
        if (vendor.status !== 'active') {
            return res.status(403).json({
                message: 'Vendor account must be approved by an administrator before publishing additional visual works.'
            });
        }

        if (!vendor.portfolioImages) vendor.portfolioImages = [];
        vendor.portfolioImages.unshift(imageUrl);
        await vendor.save();

        // If vendor is active, immediately publish the new work to the Inspiration Feed
        let newInspiration = null;
        if (vendor.status === 'active') {
            const synced = await syncVendorToInspirationFeed(vendor);
            if (synced.length > 0) newInspiration = synced[0];
        }

        res.json({ 
            message: 'Portfolio image added and published to Inspiration Feed!', 
            portfolioImages: vendor.portfolioImages,
            newInspiration
        });
    } catch (err) {
        res.status(400).json({ message: 'Error adding portfolio image', error: err.message });
    }
});

// @route   DELETE /api/vendors/:id/portfolio
// @desc    Remove image from vendor's portfolio
router.delete('/:id/portfolio', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ message: 'Image URL is required' });

        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        vendor.portfolioImages = vendor.portfolioImages.filter(img => img !== imageUrl);
        await vendor.save();

        res.json({ message: 'Portfolio image removed', portfolioImages: vendor.portfolioImages });
    } catch (err) {
        res.status(400).json({ message: 'Error removing portfolio image', error: err.message });
    }
});

// @route   POST /api/vendors
// @desc    Create/Onboard a new vendor (Admin-Controlled)
router.post('/', async (req, res) => {
    try {
        const {
            name, category, subcategories, tagline, bio, location,
            contactPhone, contactEmail, instagram, telegram, website,
            priceRange, startingPrice, avatar, coverImage,
            portfolioImages, specialties, packages, experienceYears, completedEvents, isVerified
        } = req.body;

        const newVendor = new Vendor({
            name,
            slug: generateSlug(name),
            category,
            subcategories: Array.isArray(subcategories) ? subcategories : (subcategories ? subcategories.split(',').map(s => s.trim()) : []),
            tagline,
            bio,
            location: location || 'Addis Ababa, Ethiopia',
            contactPhone,
            contactEmail,
            instagram,
            telegram,
            website,
            priceRange: priceRange || '$$$',
            startingPrice,
            avatar,
            coverImage,
            portfolioImages: Array.isArray(portfolioImages) ? portfolioImages : (portfolioImages ? portfolioImages.split(',').map(s => s.trim()) : []),
            specialties: Array.isArray(specialties) ? specialties : (specialties ? specialties.split(',').map(s => s.trim()) : []),
            packages: packages || [],
            experienceYears: Number(experienceYears) || 4,
            completedEvents: Number(completedEvents) || 80,
            isVerified: isVerified !== undefined ? isVerified : true
        });

        const savedVendor = await newVendor.save();
        res.status(201).json(savedVendor);
    } catch (err) {
        res.status(400).json({ message: 'Error onboarding vendor', error: err.message });
    }
});

// @route   PUT /api/vendors/:id
// @desc    Update vendor details
router.put('/:id', async (req, res) => {
    try {
        const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Vendor not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating vendor', error: err.message });
    }
});

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Vendor.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
