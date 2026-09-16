const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    eventType: { type: String, default: 'Wedding' },
    isPrivate: { type: Boolean, default: false },
    inspirations: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Inspiration' 
    }],
    userIdentifier: { type: String, default: 'demo_user' }, // for session or authenticated user
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);
