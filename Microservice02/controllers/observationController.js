const Observation = require('../models/Observation');
const Species = require('../models/Species');
const mongoose = require('mongoose');

// --- SPECIES ---
// POST /species
exports.createSpecies = async (req, res) => {
    try {
        const { name, dangerLevel } = req.body;
        const authorId = req.user.id;
        if (!name || !dangerLevel) {
            return res.status(400).json({ message: 'Nom et dangerLevel obligatoires' });
        }
        if (dangerLevel < 1 || dangerLevel > 5) {
            return res.status(400).json({ message: 'dangerLevel doit être entre 1 et 5' });
        }
        // Unicité du nom
        const exists = await Species.findOne({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ message: 'Une espèce avec ce nom existe déjà' });
        }
        // Prévoir dangerLevel dans le modèle !
        const species = new Species({ name: name.trim(), authorId, dangerLevel });
        await species.save();
        res.status(201).json(species);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /species/:id
exports.getSpeciesById = async (req, res) => {
    try {
        const species = await Species.findById(req.params.id);
        if (!species) return res.status(404).json({ message: 'Espèce non trouvée' });
        res.json(species);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /species
exports.getAllSpecies = async (req, res) => {
    try {
        const species = await Species.find();
        res.json(species);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- OBSERVATIONS ---
// POST /observations
exports.createObservation = async (req, res) => {
    try {
        const { speciesId, description } = req.body;
        const authorId = req.user.id;
        if (!speciesId || !description) {
            return res.status(400).json({ message: 'speciesId et description obligatoires' });
        }
        // Interdiction de soumettre deux observations de la même espèce en 5 min
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recent = await Observation.findOne({
            authorId,
            speciesId,
            createdAt: { $gte: fiveMinAgo }
        });
        if (recent) {
            return res.status(429).json({ message: 'Vous avez déjà soumis une observation pour cette espèce il y a moins de 5 minutes' });
        }
        const obs = new Observation({
            speciesId,
            authorId,
            description,
            status: 'pending',
            validatedBy: null,
            validatedAt: null
        });
        await obs.save();
        res.status(201).json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /species/:id/observations
exports.getObservationsBySpecies = async (req, res) => {
    try {
        const observations = await Observation.find({ speciesId: req.params.id });
        res.json(observations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- VALIDATION ---
// POST /observations/:id/validate
exports.validateObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });
        // Impossible de valider sa propre observation
        if (obs.authorId.toString() === req.user.id) {
            return res.status(403).json({ message: 'Impossible de valider sa propre observation' });
        }
        if (obs.status !== 'pending') {
            return res.status(400).json({ message: 'Observation déjà traitée' });
        }
        obs.status = 'validated';
        obs.validatedBy = req.user.id;
        obs.validatedAt = new Date();
        await obs.save();
        res.json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /observations/:id/reject
exports.rejectObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });
        // Impossible de rejeter sa propre observation
        if (obs.authorId.toString() === req.user.id) {
            return res.status(403).json({ message: 'Impossible de rejeter sa propre observation' });
        }
        if (obs.status !== 'pending') {
            return res.status(400).json({ message: 'Observation déjà traitée' });
        }
        obs.status = 'rejected';
        obs.validatedBy = req.user.id;
        obs.validatedAt = new Date();
        await obs.save();
        res.json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

