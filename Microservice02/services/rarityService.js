const Observation = require('../models/Observation');

/**
 * Calcule le rarityScore d'une espèce
 * Formule : rarityScore = 1 + (nombreObservationsValidées / 5)
 * @param {String} speciesId - ID de l'espèce
 */
exports.calculateRarityScore = async (speciesId) => {
    try {
        const validatedCount = await Observation.countDocuments({
            speciesId,
            status: 'validated'
        });

        const rarityScore = 1 + (validatedCount / 5);
        return parseFloat(rarityScore.toFixed(2));
    } catch (err) {
        console.error('Erreur lors du calcul du rarityScore:', err.message);
        return 1;
    }
};

/**
 * Met à jour le rarityScore d'une espèce
 * @param {Object} species - Objet espèce
 */
exports.updateRarityScore = async (species) => {
    try {
        const rarityScore = await exports.calculateRarityScore(species._id);
        species.rarityScore = rarityScore;
        await species.save();
        return species;
    } catch (err) {
        console.error('Erreur lors de la mise à jour du rarityScore:', err.message);
        throw err;
    }
};

