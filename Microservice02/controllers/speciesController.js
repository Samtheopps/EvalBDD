const Species = require('../models/Species');

// POST /species
exports.createSpecies = async (req, res) => {
    try {
        const { name } = req.body;
        const authorId = req.user.id;
        if (!name) {
            return res.status(400).json({ message: 'Nom obligatoire' });
        }
        // Unicité du nom
        const exists = await Species.findOne({ name: name.trim() });
        if (exists) {
            return res.status(409).json({ message: 'Une espèce avec ce nom existe déjà' });
        }
        const species = new Species({ name: name.trim(), authorId });
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

