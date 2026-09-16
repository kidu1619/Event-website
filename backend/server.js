const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

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

const os = require('os');

// Helper to determine primary local network IPv4 address
function getLocalNetworkIp() {
    const interfaces = os.networkInterfaces();
    let fallbackIp = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                // Prioritize Wi-Fi / WLAN or standard home 192.168.x.x / 10.x.x addresses
                const isWifi = name.toLowerCase().includes('wi-fi') || name.toLowerCase().includes('wireless') || name.toLowerCase().includes('wlan');
                if (isWifi || iface.address.startsWith('192.168.1.') || iface.address.startsWith('192.168.0.')) {
                    return iface.address;
                }
                fallbackIp = iface.address;
            }
        }
    }
    return fallbackIp;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0 (Visual Core)', timestamp: new Date() });
});

// Network information endpoint for mobile accessibility and QR connection
app.get('/api/network-info', (req, res) => {
    const lanIp = getLocalNetworkIp();
    const port = PORT;
    const vitePort = 5173;
    res.json({
        ip: lanIp,
        backendPort: port,
        frontendPort: vitePort,
        mobileUrl: `http://${lanIp}:${vitePort}`,
        backendUrl: `http://${lanIp}:${port}`
    });
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_platform_db';

mongoose.connect(MONGO_URI)
  .then(() => {
      console.log('MongoDB Connected successfully to:', MONGO_URI);
      const lanIp = getLocalNetworkIp();
      app.listen(PORT, '0.0.0.0', () => {
          console.log(`🚀 Event Platform API Server running on port ${PORT} (0.0.0.0)`);
          console.log(`📱 Local Network API: http://${lanIp}:${PORT}/api`);
          console.log(`📱 Mobile Frontend:   http://${lanIp}:5173`);
      });
  })
  .catch(err => console.error('MongoDB connection error:', err));