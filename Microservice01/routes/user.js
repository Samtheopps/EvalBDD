const express = require('express')
const router = express.Router()

const {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController')


router.get('/',getAllUser)
router.get('/:id', getUserById)
router.post('/', createUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)

module.exports = router