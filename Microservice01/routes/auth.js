const express = require('express');
const router = express.Router();

const { login, me } = require('../controllers/authController');
const { authenticateJWT, hashPassword } = require('../middlewares/authmiddlewares');
const UserController = require('../controllers/userController');


router.post('/register', hashPassword, UserController.createUser);
router.post('/login', login);
router.get('/me', authenticateJWT, me);

module.exports = router;

