const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    vendorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor', 
        required: true 
    },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    eventType: { 
        type: String, 
        enum: ['Modern Wedding', 'Traditional Melse', 'Corporate Gala', 'Private Celebration', 'Engagement', 'Photo/Video Shoot', 'Other'],
        required: true 
    },
    eventDate: { type: Date },
    location: { type: String, default: 'Addis Ababa' },
    guestCount: { type: String }, // e.g. "100-250 guests"
    budgetRange: { type: String }, // e.g. "50,000 - 150,000 ETB"
    message: { type: String, required: true },
    servicesNeeded: [{ type: String }],
    status: { 
        type: String, 
        enum: ['New', 'In Review', 'Quoted', 'Declined', 'Confirmed'], 
        default: 'New' 
    },
    adminNotes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
