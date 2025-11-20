const Observation = require('../models/Observation');
const History = require('../models/History');

// Soft delete d'une observation (ADMIN uniquement)
exports.softDeleteObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });

        if (obs.deletedAt) {
            return res.status(400).json({ message: 'Observation déjà supprimée' });
        }

        obs.deletedAt = new Date();
        obs.deletedBy = req.user.id;
        await obs.save();

        // Ajoute dans l'historique
        await History.create({
            targetType: 'observation',
            targetId: obs._id,
            action: 'deleted',
            performedBy: req.user.id,
            performedByRole: req.user.role,
            details: `Observation supprimée par ${req.user.role}`
        });

        res.json({ message: 'Observation supprimée avec succès', observation: obs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Restaurer une observation supprimée (ADMIN uniquement)
exports.restoreObservation = async (req, res) => {
    try {
        const obs = await Observation.findById(req.params.id);
        if (!obs) return res.status(404).json({ message: 'Observation non trouvée' });

        if (!obs.deletedAt) {
            return res.status(400).json({ message: 'Observation non supprimée' });
        }

        obs.deletedAt = null;
        obs.deletedBy = null;
        await obs.save();

        // Ajoute dans l'historique
        await History.create({
            targetType: 'observation',
            targetId: obs._id,
            action: 'restored',
            performedBy: req.user.id,
            performedByRole: req.user.role,
            details: `Observation restaurée par ${req.user.role}`
        });

        res.json({ message: 'Observation restaurée avec succès', observation: obs });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Historique d'un utilisateur (ADMIN uniquement)
exports.getUserHistory = async (req, res) => {
    try {
        const history = await History.find({
            $or: [
                { targetId: req.params.id, targetType: 'user' },
                { performedBy: req.params.id }
            ]
        }).sort({ timestamp: -1 });

        res.json({ userId: req.params.id, history });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Historique d'une espèce (EXPERT/ADMIN)
exports.getSpeciesHistory = async (req, res) => {
    try {
        const history = await History.find({
            targetType: 'observation',
            targetId: { $in: await Observation.find({ speciesId: req.params.id }).distinct('_id') }
        }).sort({ timestamp: -1 });

        res.json({ speciesId: req.params.id, history });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

