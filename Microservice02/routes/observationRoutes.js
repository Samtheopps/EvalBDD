const express = require('express')
const router = express.Router()

const {
    createObservation,
    validateObservation,
    rejectObservation,
} = require('../controllers/observationController')

router.post('/',createObservation)
router.post('/:id/validate', validateObservation)
router.post('/:id/reject', rejectObservation)

module.exports = router