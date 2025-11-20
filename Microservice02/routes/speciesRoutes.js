const express = require('express')
const router = express.Router()

const {
    getallSpecies,
    getSpeciesById,
    getSpeciesByObservationId
} = require('../controllers/speciesController')

router.get('/', getallSpecies)
router.get('/:id', getSpeciesById)
router.get('/observation/:observationId', getSpeciesByObservationId)

module.exports = router