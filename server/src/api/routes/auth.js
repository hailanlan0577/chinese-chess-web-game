const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user profile
router.get('/profile', authMiddleware.authenticateToken, authController.getProfile);

// Update user profile
router.put('/profile', authMiddleware.authenticateToken, authController.updateProfile);

// Refresh token
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authMiddleware.authenticateToken, authController.logout);

module.exports = router;