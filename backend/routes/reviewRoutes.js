const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Vendor = require('../models/Vendor');

// @route   GET /api/reviews/vendor/:vendorId
// @desc    Get all reviews for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
    try {
        const reviews = await Review.find({ vendorId: req.params.vendorId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   POST /api/reviews
// @desc    Submit a verified client review
router.post('/', async (req, res) => {
    try {
        const { vendorId, authorName, authorRole, rating, eventType, comment } = req.body;
        
        if (!vendorId || !authorName || !rating || !comment) {
            return res.status(400).json({ message: 'Please provide all required review fields' });
        }

        const review = new Review({
            vendorId,
            authorName,
            authorRole: authorRole || 'Event Host',
            rating: Number(rating),
            eventType: eventType || 'Wedding',
            comment
        });

        const saved = await review.save();

        // Update vendor average rating
        const allReviews = await Review.find({ vendorId });
        const avg = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        await Vendor.findByIdAndUpdate(vendorId, {
            rating: parseFloat(avg.toFixed(1)),
            reviewsCount: allReviews.length
        });

        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error submitting review', error: err.message });
    }
});

module.exports = router;
