const express = require('express')
const router = express.Router()

const {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController')

const { hashPassword, authenticateJWT, authorizeRoles, adminOnly } = require('../middlewares/authmiddlewares')

// Routes publiques / inscription
router.post('/', hashPassword, createUser)

// Routes protégées
router.get('/', authenticateJWT, authorizeRoles('ADMIN','EXPERT','USER'), getAllUser)
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN','EXPERT','USER'), getUserById)
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN','EXPERT'), updateUser)
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteUser)

// Exemple de route réservée admin
router.get('/admin/list', authenticateJWT, adminOnly, getAllUser)

module.exports = router