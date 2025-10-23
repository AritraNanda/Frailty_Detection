const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN || true 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// Database connection
const connectDB = require('./config/database');
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Health check route for API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Frailty Detection API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build (production only)
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend build
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Development mode - show API info at root
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Frailty Detection API - Development Mode',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        patients: '/api/patients',
        doctors: '/api/doctors'
      }
    });
  });
}

// Error handling middleware (only applied if no route matched)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
