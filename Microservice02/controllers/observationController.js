const Observation = require('../models/Observation');
const Species = require('../models/Species');
const reputationService = require('../services/reputationService');
const rarityService = require('../services/rarityService');


// Créer une nouvelle observation
exports.createObservation = async (req, res) => {
    try {
        const { speciesId, description } = req.body;
        const authorId = req.user.id;
        // Vérifie les champs obligatoires
        if (!speciesId || !description) {
            return res.status(400).json({ message: 'speciesId et description obligatoires' });
        }
        // Vérifie le délai de 5 minutes entre deux observations de la même espèce
        const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recent = await Observation.findOne({
            authorId,
            speciesId,
            createdAt: { $gte: fiveMinAgo }
        });
        if (recent) {
            return res.status(429).json({ message: 'Vous avez déjà soumis une observation pour cette espèce il y a moins de 5 minutes' });
        }
        // Création de l'observation
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


// Lister les observations d'une espèce
exports.getObservationsBySpecies = async (req, res) => {
    try {
        const observations = await Observation.find({ speciesId: req.params.id });
        res.json(observations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Valider une observation
exports.validateObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });
        // Interdit de valider sa propre observation
        if (obs.authorId.toString() === req.user.id) {
            return res.status(403).json({ message: 'Impossible de valider sa propre observation' });
        }
        // Vérifie que l'observation est en attente
        if (obs.status !== 'pending') {
            return res.status(400).json({ message: 'Observation déjà traitée' });
        }
        // Récupère le JWT
        const authHeader = req.headers.authorization;
        const jwt = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        // Ajoute la réputation à l'auteur
        try {
            await reputationService.addReputation(obs.authorId, 3, 'Observation validée', jwt);
        } catch (err) {
            console.error('Erreur lors de l\'ajout de réputation à l\'auteur:', err.message);
        }
        // Bonus de réputation pour un expert
        try {
            if (req.user.role === 'EXPERT') {
                await reputationService.addReputation(req.user.id, 1, 'Validation effectuée en tant qu\'expert', jwt);
            }
        } catch (err) {
            console.error('Erreur lors de l\'ajout de réputation au validateur:', err.message);
        }
        // Met à jour le rarityScore de l'espèce
        try {
            const species = await Species.findById(obs.speciesId);
            if (species) {
                await rarityService.updateRarityScore(species);
            }
        } catch (err) {
            console.error('Erreur lors de la mise à jour du rarityScore:', err.message);
        }
        // Met à jour le statut de l'observation
        obs.status = 'validated';
        obs.validatedBy = req.user.id;
        obs.validatedAt = new Date();
        await obs.save();
        res.json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Rejeter une observation
exports.rejectObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });
        // Interdit de rejeter sa propre observation
        if (obs.authorId.toString() === req.user.id) {
            return res.status(403).json({ message: 'Impossible de rejeter sa propre observation' });
        }
        // Vérifie que l'observation est en attente
        if (obs.status !== 'pending') {
            return res.status(400).json({ message: 'Observation déjà traitée' });
        }
        // Met à jour le statut de l'observation
        obs.status = 'rejected';
        obs.validatedBy = req.user.id;
        obs.validatedAt = new Date();
        await obs.save();
        // Retire de la réputation à l'auteur
        try {
            const authHeader = req.headers.authorization;
            const jwt = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
            await reputationService.addReputation(obs.authorId, -1, 'Observation rejetée', jwt);
        } catch (err) {
            console.error('Erreur lors du retrait de réputation à l\'auteur:', err.message);
        }
        res.json(obs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
