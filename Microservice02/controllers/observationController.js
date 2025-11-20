const Observation = require('../models/Observation');
const Species = require('../models/Species');
const reputationService = require('../services/reputationService');
const rarityService = require('../services/rarityService');

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

        // Ajouter la réputation à l'auteur de l'observation (+3)
        try {
            await reputationService.addReputation(obs.authorId, 3, 'Observation validée');
        } catch (err) {
            console.error('Erreur lors de l\'ajout de réputation à l\'auteur:', err.message);
        }

        // Ajouter la réputation au validateur (+1 si expert)
        try {
            if (req.user.role === 'EXPERT') {
                await reputationService.addReputation(req.user.id, 1, 'Validation effectuée en tant qu\'expert');
            }
        } catch (err) {
            console.error('Erreur lors de l\'ajout de réputation au validateur:', err.message);
        }

        // Mettre à jour le rarityScore de l'espèce
        try {
            const species = await Species.findById(obs.speciesId);
            if (species) {
                await rarityService.updateRarityScore(species);
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour du rarityScore:', err.message);
        }

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

        // Retirer de la réputation à l'auteur de l'observation (-1)
        try {
            await reputationService.addReputation(obs.authorId, -1, 'Observation rejetée');
        } catch (err) {
            console.error('Erreur lors du retrait de réputation à l\'auteur:', err.message);
        }

        res.json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

