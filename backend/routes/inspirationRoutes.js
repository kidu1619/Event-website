const express = require('express');
const router = express.Router();
const Inspiration = require('../models/Inspiration');
const Vendor = require('../models/Vendor');

// @route   GET /api/inspirations
// @desc    Get all inspirations with filtering, search and sorting
router.get('/', async (req, res) => {
    try {
        const { category, eventType, search, tag, featured, vendorId } = req.query;
        let query = {};

        if (vendorId) {
            query.vendorId = vendorId;
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (eventType && eventType !== 'All') {
            query.eventType = eventType;
        }

        if (tag) {
            query.tags = { $in: [new RegExp(tag, 'i')] };
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (search && search.trim()) {
            const trimmed = search.trim();
            const matchingVendors = await Vendor.find({
                $or: [
                    { name: { $regex: trimmed, $options: 'i' } },
                    { bio: { $regex: trimmed, $options: 'i' } },
                    { tagline: { $regex: trimmed, $options: 'i' } },
                    { location: { $regex: trimmed, $options: 'i' } },
                    { specialties: { $in: [new RegExp(trimmed, 'i')] } },
                    { subcategories: { $in: [new RegExp(trimmed, 'i')] } },
                    { category: { $regex: trimmed, $options: 'i' } }
                ]
            }).select('_id');
            const vendorIds = matchingVendors.map(v => v._id);

            query.$or = [
                { title: { $regex: trimmed, $options: 'i' } },
                { description: { $regex: trimmed, $options: 'i' } },
                { tags: { $in: [new RegExp(trimmed, 'i')] } },
                { subCategory: { $regex: trimmed, $options: 'i' } },
                { category: { $regex: trimmed, $options: 'i' } },
                { eventType: { $regex: trimmed, $options: 'i' } },
                { location: { $regex: trimmed, $options: 'i' } },
                ...(vendorIds.length > 0 ? [{ vendorId: { $in: vendorIds } }] : [])
            ];
        }

        const inspirations = await Inspiration.find(query)
            .populate('vendorId', 'name category rating isVerified avatar location priceRange status')
            .sort({ featured: -1, createdAt: -1 });

        // Filter out pending unapproved vendors from public feed unless vendorId is specified for their own dashboard
        const visibleInspirations = inspirations.filter(item => {
            if (vendorId) return true;
            if (item.vendorId && item.vendorId.status === 'pending') return false;
            return true;
        });

        res.json(visibleInspirations);
    } catch (err) {
        console.error('Error fetching inspirations:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   GET /api/inspirations/:id
// @desc    Get single inspiration with full details and related inspirations
router.get('/:id', async (req, res) => {
    try {
        const inspiration = await Inspiration.findById(req.params.id)
            .populate('vendorId');

        if (!inspiration) {
            return res.status(404).json({ message: 'Inspiration not found' });
        }

        // Increment view count
        inspiration.viewsCount = (inspiration.viewsCount || 0) + 1;
        await inspiration.save();

        // Get related inspirations
        const related = await Inspiration.find({
            _id: { $ne: inspiration._id },
            $or: [
                { category: inspiration.category },
                { eventType: inspiration.eventType }
            ]
        }).limit(4).populate('vendorId', 'name category rating avatar status');

        res.json({ inspiration, related });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// @route   POST /api/inspirations
// @desc    Create new inspiration (Admin/Curator or Approved Vendor)
router.post('/', async (req, res) => {
    try {
        const { title, description, imageUrl, category, subCategory, eventType, vendorId, palette, tags, aspectRatio, featured } = req.body;
        
        if (vendorId) {
            const Vendor = require('../models/Vendor');
            const vendor = await Vendor.findById(vendorId);
            if (vendor && vendor.status !== 'active') {
                return res.status(403).json({
                    message: 'Vendor account must be approved by an administrator before publishing additional visual works.'
                });
            }
        }

        const newInspiration = new Inspiration({
            title,
            description,
            imageUrl,
            category,
            subCategory,
            eventType,
            vendorId,
            palette: Array.isArray(palette) ? palette : (palette ? palette.split(',').map(s => s.trim()) : []),
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(s => s.trim()) : []),
            aspectRatio: aspectRatio || '4/5',
            featured: Boolean(featured)
        });

        const saved = await newInspiration.save();
        const populated = await Inspiration.findById(saved._id).populate('vendorId', 'name category rating avatar');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: 'Error creating inspiration', error: err.message });
    }
});

// @route   POST /api/inspirations/:id/like
// @desc    Toggle like counter
router.post('/:id/like', async (req, res) => {
    try {
        const item = await Inspiration.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Not found' });
        
        item.likesCount = (item.likesCount || 0) + 1;
        await item.save();
        res.json({ likesCount: item.likesCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   DELETE /api/inspirations/:id
// @desc    Delete inspiration post
router.delete('/:id', async (req, res) => {
    try {
        const item = await Inspiration.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Inspiration deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;