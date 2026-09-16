const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Inspiration = require('../models/Inspiration');
const Inquiry = require('../models/Inquiry');
const Board = require('../models/Board');

// @route   GET /api/admin/stats
// @desc    Get aggregate analytics metrics for the curation portal
router.get('/stats', async (req, res) => {
    try {
        const [
            totalInspirations,
            totalVendors,
            decorVendors,
            mediaVendors,
            totalInquiries,
            newInquiries,
            totalBoards
        ] = await Promise.all([
            Inspiration.countDocuments(),
            Vendor.countDocuments(),
            Vendor.countDocuments({ category: 'Decor' }),
            Vendor.countDocuments({ category: 'Media' }),
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'New' }),
            Board.countDocuments()
        ]);

        const recentInspirations = await Inspiration.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('vendorId', 'name category');

        const recentInquiries = await Inquiry.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('vendorId', 'name category');

        res.json({
            metrics: {
                totalInspirations,
                totalVendors,
                decorVendors,
                mediaVendors,
                totalInquiries,
                newInquiries,
                totalBoards,
                curationStatus: '100% Admin Verified'
            },
            recentInspirations,
            recentInquiries
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
