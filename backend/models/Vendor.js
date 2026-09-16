const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    password: { type: String },
    category: { 
        type: String, 
        enum: ['Decor', 'Media', 'Catering', 'AV & Sound', 'Venue'], 
        required: true 
    },
    subcategories: [{ type: String }],
    tagline: { type: String },
    bio: { type: String },
    location: { type: String, default: 'Addis Ababa, Ethiopia' },
    address: { type: String },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: true },
    badge: { type: String, default: 'Admin Curated Elite' },
    contactPhone: { type: String },
    contactEmail: { type: String },
    instagram: { type: String },
    telegram: { type: String },
    website: { type: String },
    priceRange: { type: String, default: '$$$' },
    startingPrice: { type: String },
    avatar: { type: String },
    coverImage: { type: String },
    portfolioImages: [{ type: String }],
    specialties: [{ type: String }],
    packages: [{
        name: { type: String },
        price: { type: String },
        features: [{ type: String }]
    }],
    experienceYears: { type: Number, default: 5 },
    completedEvents: { type: Number, default: 120 },
    status: { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);