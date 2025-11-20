const express = require('express')
const router = express.Router()

const {
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
} = require('../controllers/userController')

const {
    addOrUpdateReputation,
    getReputation
} = require('../controllers/reputationController')

const {authenticateJWT, authorizeRoles, } = require('../middlewares/authmiddlewares')


router.get('/', authenticateJWT, authorizeRoles('ADMIN'), getAllUser)
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN'), getUserById)
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN','EXPERT'), updateUser)
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), deleteUser)
router.patch('/:id', authenticateJWT, authorizeRoles('ADMIN'), changeUserRole)

router.post('/:id/reputation', authenticateJWT, authorizeRoles('ADMIN','EXPERT'), addOrUpdateReputation);
router.get('/:id/reputation', authenticateJWT, authorizeRoles('ADMIN','EXPERT'), getReputation);


module.exports = router

