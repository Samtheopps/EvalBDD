// Microservice01/controllers/reputationController.js
const User = require('../models/user');

exports.addOrUpdateReputation = async (req, res) => {
    console.log(req.body)
    try {
        const { points, reason  } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        user.reputation = (user.reputation || 0) + points;
        console.log(user.reputation);

        // Promotion automatique en expert
        if (user.reputation >= 10 && user.role !== 'EXPERT') {
            user.role = 'EXPERT';
        }

        await user.save();
        res.json({ reputation: user.reputation, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la réputation', err });
    }
};

exports.getReputation = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json({ reputation: user.reputation || 0, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la réputation' });
    }
};
