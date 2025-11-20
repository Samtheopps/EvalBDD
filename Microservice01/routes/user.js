const express = require('express')
const router = express.Router()

const {
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
} = require('../controllers/userController')

const {authenticateJWT, authorizeRoles, adminOnly } = require('../middlewares/authmiddlewares')


router.get('/', authenticateJWT, authorizeRoles('ADMIN','EXPERT','USER'), getAllUser)
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN','EXPERT','USER'), getUserById)
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN','EXPERT'), updateUser)
router.delete('/:id', authenticateJWT, adminOnly, deleteUser)
router.patch('/:id/role', authenticateJWT, adminOnly, changeUserRole)
router.get('/admin/list', authenticateJWT, adminOnly, getAllUser)

module.exports = router