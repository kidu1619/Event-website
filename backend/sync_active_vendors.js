const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const Inspiration = require('./models/Inspiration');

async function runSync() {
    await mongoose.connect('mongodb://127.0.0.1:27017/event_platform_db');
    const vendors = await Vendor.find({ status: 'active' });
    console.log(`Found ${vendors.length} active vendors to sync.`);

    let createdCount = 0;
    for (const v of vendors) {
        const candidateImages = [];
        if (Array.isArray(v.portfolioImages)) {
            v.portfolioImages.forEach(img => {
                if (img && typeof img === 'string' && img.trim() && !candidateImages.includes(img.trim())) {
                    candidateImages.push(img.trim());
                }
            });
        }
        if (v.coverImage && typeof v.coverImage === 'string' && v.coverImage.trim() && !candidateImages.includes(v.coverImage.trim())) {
            candidateImages.push(v.coverImage.trim());
        }

        if (candidateImages.length === 0) {
            candidateImages.push(
                v.category === 'Media'
                    ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
            );
        }

        const validCategories = ['Decor', 'Media', 'Floral Art', 'Lighting & Stage', 'Traditional', 'Modern Luxury'];
        const primaryCat = validCategories.includes(v.category) ? v.category : 'Decor';

        for (let i = 0; i < candidateImages.length; i++) {
            const imgUrl = candidateImages[i];
            const existing = await Inspiration.findOne({ vendorId: v._id, imageUrl: imgUrl });
            if (!existing) {
                const specialty = (v.specialties && v.specialties.length > 0)
                    ? v.specialties[i % v.specialties.length]
                    : (v.category === 'Decor' ? 'Luxury Stage & Scenography' : 'Cinematic Visual Portfolio');

                const isTraditional = (v.specialties && v.specialties.some(s => /traditional|melse/i.test(s))) ||
                                      /traditional|melse/i.test(v.tagline || '') ||
                                      /traditional|melse/i.test(v.bio || '');

                const eventType = isTraditional && i % 2 === 0
                    ? 'Traditional Melse'
                    : (i === 1 ? 'Corporate Gala' : 'Modern Wedding');

                const newInsp = new Inspiration({
                    title: `${v.name} • ${specialty}`,
                    description: v.bio || v.tagline || `Curated ${v.category} installation designed and executed by ${v.name}.`,
                    imageUrl: imgUrl,
                    category: isTraditional && i % 2 === 0 ? 'Traditional' : primaryCat,
                    subCategory: specialty,
                    eventType: eventType,
                    vendorId: v._id,
                    palette: primaryCat === 'Media' 
                        ? ['#12151B', '#D4AF37', '#EAD5B5', '#836547']
                        : ['#D4AF37', '#FAF5EC', '#1C1917', '#EAD5B5', '#9E7A1B'],
                    tags: [primaryCat, specialty, 'Admin Curated', 'Verified Creator', v.location || 'Addis Ababa'].filter(Boolean),
                    location: v.location || 'Addis Ababa',
                    featured: i === 0,
                    likesCount: Math.floor(Math.random() * 12) + 3
                });

                await newInsp.save();
                createdCount++;
            }
        }
    }

    const totalInspirations = await Inspiration.countDocuments();
    console.log(`Sync complete! Added ${createdCount} new inspirations. Total in database: ${totalInspirations}`);
    await mongoose.disconnect();
}

runSync().catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
});
