const express = require('express');
const router = express.Router();
const { login, verify, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin, validate } = require('../middleware/validator');

// Public routes
router.post('/login', validateLogin, validate, login);

// Protected routes
router.get('/verify', protect, verify);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
