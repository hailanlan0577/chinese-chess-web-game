const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth');

// Get all games for current user
router.get('/', authMiddleware.authenticateToken, gameController.getUserGames);

// Get a specific game
router.get('/:id', authMiddleware.authenticateToken, gameController.getGame);

// Create a new game
router.post('/', authMiddleware.authenticateToken, gameController.createGame);

// Make a move in a game
router.post('/:id/move', authMiddleware.authenticateToken, gameController.makeMove);

// Forfeit a game
router.post('/:id/forfeit', authMiddleware.authenticateToken, gameController.forfeitGame);

// Get game history (previous moves)
router.get('/:id/history', authMiddleware.authenticateToken, gameController.getGameHistory);

// Get game statistics
router.get('/stats', authMiddleware.authenticateToken, gameController.getGameStats);

module.exports = router;