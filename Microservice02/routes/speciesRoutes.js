const express = require('express')
const router = express.Router()
const auth = require('../middleware/authmiddleware')

const {
    getAllSpecies,
    getSpeciesById,
    createSpecies
} = require('../controllers/speciesController')

router.get('/', auth, getAllSpecies)
router.get('/:id', auth, getSpeciesById)
router.post('/', auth, createSpecies)

const { getObservationsBySpecies } = require('../controllers/observationController')
router.get('/:id/observations', auth, getObservationsBySpecies)

module.exports = router