const express = require('express');
const router = express.Router();
const taxonomyController = require('../controllers/taxonomyController');

router.get('/stats', taxonomyController.getTaxonomyStats);

module.exports = router;

