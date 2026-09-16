const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// @route   GET /api/inquiries
// @desc    Get all inquiries (with vendor details, filtered by status)
router.get('/', async (req, res) => {
    try {
        const { status, vendorId } = req.query;
        let query = {};
        if (status && status !== 'All') query.status = status;
        if (vendorId) query.vendorId = vendorId;

        const inquiries = await Inquiry.find(query)
            .populate('vendorId', 'name category contactPhone contactEmail avatar')
            .sort({ createdAt: -1 });

        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   POST /api/inquiries
// @desc    Submit a direct quote inquiry
router.post('/', async (req, res) => {
    try {
        const {
            vendorId, clientName, clientEmail, clientPhone,
            eventType, eventDate, location, guestCount, budgetRange,
            message, servicesNeeded
        } = req.body;

        if (!vendorId || !clientName || !clientEmail || !clientPhone || !message) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        const newInquiry = new Inquiry({
            vendorId,
            clientName,
            clientEmail,
            clientPhone,
            eventType: eventType || 'Modern Wedding',
            eventDate: eventDate ? new Date(eventDate) : undefined,
            location: location || 'Addis Ababa',
            guestCount,
            budgetRange,
            message,
            servicesNeeded: Array.isArray(servicesNeeded) ? servicesNeeded : (servicesNeeded ? [servicesNeeded] : [])
        });

        const saved = await newInquiry.save();
        const populated = await Inquiry.findById(saved._id).populate('vendorId', 'name category contactPhone avatar');
        
        res.status(201).json({
            success: true,
            message: 'Inquiry successfully submitted to vendor & platform curation team!',
            inquiry: populated
        });
    } catch (err) {
        res.status(400).json({ message: 'Error submitting inquiry', error: err.message });
    }
});

// @route   PATCH /api/inquiries/:id/status
// @desc    Update inquiry status (Admin / Vendor control)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes },
            { new: true }
        ).populate('vendorId', 'name category');

        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.json(inquiry);
    } catch (err) {
        res.status(400).json({ message: 'Error updating inquiry status', error: err.message });
    }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete inquiry
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Inquiry.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
