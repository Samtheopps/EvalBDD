const express = require('express');
const router = express.Router();

const { login, me } = require('../controllers/authController');
const { authenticateJWT, hashPassword } = require('../middlewares/authmiddlewares');
const UserController = require('../controllers/userController');

// register via existing createUser logic but with hashPassword middleware
router.post('/register', hashPassword, UserController.createUser);
router.post('/login', login);
router.get('/me', authenticateJWT, me);

module.exports = router;

