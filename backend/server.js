const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Database Connection with Serverless Caching
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_platform_db';

let cachedConnection = global.mongoose;
if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }
  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(MONGO_URI).then((m) => {
      console.log('MongoDB connected successfully');
      return m;
    });
  }
  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

// Ensure DB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Import Routes
const inspirationRoutes = require('./routes/inspirationRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const boardRoutes = require('./routes/boardRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use Routes
app.use('/api/inspirations', inspirationRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0 (Visual Core)', timestamp: new Date() });
});

// Run local listener only when running locally (not in production / Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Event Platform API running locally on port ${PORT}`);
  });
}

// Export for Vercel Serverless
module.exports = app;