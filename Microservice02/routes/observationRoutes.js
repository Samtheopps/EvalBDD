const express = require('express')
const router = express.Router()
const auth = require('../middleware/authmiddleware')
const role = require('../middleware/role')

const {
    createObservation,
    validateObservation,
    rejectObservation,
} = require('../controllers/observationController')

router.post('/', auth, createObservation)
router.post('/:id/validate', auth,  role('EXPERT', 'ADMIN'), validateObservation)
router.post('/:id/reject', auth, role('EXPERT', 'ADMIN'), rejectObservation)

module.exports = router