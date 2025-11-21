const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const role = require('../middleware/role');
const moderationController = require('../controllers/moderationController');

// Routes ADMIN
router.delete('/observations/:id', auth, role('ADMIN'), moderationController.softDeleteObservation);
router.post('/observations/:id/restore', auth, role('ADMIN'), moderationController.restoreObservation);
router.get('/user/:id/history', auth, role('ADMIN'), moderationController.getUserHistory);

// Routes EXPERT/ADMIN
router.get('/species/:id/history', auth, role('EXPERT', 'ADMIN'), moderationController.getSpeciesHistory);

module.exports = router;

