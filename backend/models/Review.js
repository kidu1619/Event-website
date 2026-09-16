const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true 
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'Event Host' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    eventType: { type: String, default: 'Wedding' },
    comment: { type: String, required: true },
    date: { type: String, default: 'Recent event' },
    verifiedBooking: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
