const mongoose = require('mongoose');

const InspirationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Decor', 'Media', 'Floral Art', 'Lighting & Stage', 'Traditional', 'Modern Luxury'],
        required: true 
    },
    subCategory: { type: String },
    eventType: { 
        type: String, 
        enum: ['Modern Wedding', 'Traditional Melse', 'Corporate Gala', 'Private Celebration', 'Engagement', 'Fashion & Editorial'],
        default: 'Modern Wedding'
    },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    palette: [{ type: String }], // Array of hex colors, e.g. ['#F7EDE2', '#84A59D', '#F28482']
    tags: [{ type: String }],
    likesCount: { type: Number, default: 0 },
    savesCount: { type: Number, default: 0 },
    aspectRatio: { type: String, default: '4/5' }, // e.g. 1/1, 4/5, 9/16, 16/9
    featured: { type: Boolean, default: false },
    location: { type: String, default: 'Addis Ababa' },
    viewsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inspiration', InspirationSchema);