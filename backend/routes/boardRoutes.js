const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const Inspiration = require('../models/Inspiration');

// @route   GET /api/boards
// @desc    Get all user boards (with populated inspirations)
router.get('/', async (req, res) => {
    try {
        const boards = await Board.find()
            .populate({
                path: 'inspirations',
                populate: { path: 'vendorId', select: 'name category avatar' }
            })
            .sort({ updatedAt: -1 });

        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   GET /api/boards/:id
// @desc    Get single board details
router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate({
                path: 'inspirations',
                populate: { path: 'vendorId', select: 'name category avatar location priceRange rating contactPhone' }
            });

        if (!board) return res.status(404).json({ message: 'Board not found' });
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   POST /api/boards
// @desc    Create a new board
router.post('/', async (req, res) => {
    try {
        const { title, description, eventType, isPrivate, initialInspirationId } = req.body;
        
        const inspirations = initialInspirationId ? [initialInspirationId] : [];
        let coverImage = '';
        
        if (initialInspirationId) {
            const insp = await Inspiration.findById(initialInspirationId);
            if (insp) coverImage = insp.imageUrl;
        }

        const newBoard = new Board({
            title: title || 'My Event Inspiration',
            description,
            eventType: eventType || 'Modern Wedding',
            isPrivate: Boolean(isPrivate),
            coverImage,
            inspirations
        });

        const saved = await newBoard.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: 'Error creating board', error: err.message });
    }
});

// @route   POST /api/boards/:id/pins
// @desc    Add inspiration pin to board
router.post('/:id/pins', async (req, res) => {
    try {
        const { inspirationId } = req.body;
        const board = await Board.findById(req.params.id);
        
        if (!board) return res.status(404).json({ message: 'Board not found' });

        if (!board.inspirations.includes(inspirationId)) {
            board.inspirations.push(inspirationId);
            board.updatedAt = Date.now();
            
            // If board doesn't have a cover, use this image
            if (!board.coverImage) {
                const insp = await Inspiration.findById(inspirationId);
                if (insp) board.coverImage = insp.imageUrl;
            }
            
            await board.save();

            // Increment savesCount on inspiration
            await Inspiration.findByIdAndUpdate(inspirationId, { $inc: { savesCount: 1 } });
        }

        const populated = await Board.findById(board._id).populate({
            path: 'inspirations',
            populate: { path: 'vendorId', select: 'name category avatar' }
        });

        res.json(populated);
    } catch (err) {
        res.status(500).json({ message: 'Error pinning item', error: err.message });
    }
});

// @route   DELETE /api/boards/:id/pins/:pinId
// @desc    Remove inspiration pin from board
router.delete('/:id/pins/:pinId', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) return res.status(404).json({ message: 'Board not found' });

        board.inspirations = board.inspirations.filter(id => id.toString() !== req.params.pinId);
        board.updatedAt = Date.now();
        await board.save();

        res.json({ message: 'Pin removed from board', board });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// @route   DELETE /api/boards/:id
// @desc    Delete board
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Board.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Board not found' });
        res.json({ message: 'Board deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
