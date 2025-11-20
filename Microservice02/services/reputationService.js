const axios = require('axios');

const MICROSERVICE1_URL = process.env.MICROSERVICE1_URL || 'http://localhost:3000';

/**
 * Ajoute de la réputation à un utilisateur
 * @param {String} userId - ID de l'utilisateur
 * @param {Number} points - Points à ajouter (positif ou négatif)
 * @param {String} reason - Raison de l'ajout
 */
exports.addReputation = async (userId, points, reason) => {
    try {
        const response = await axios.post(
            `${MICROSERVICE1_URL}/api/users/${userId}/reputation`,
            { points, reason },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Erreur lors de l\'ajout de réputation:', err.message);
        throw err;
    }
};

/**
 * Récupère la réputation d'un utilisateur
 * @param {String} userId - ID de l'utilisateur
 */
exports.getReputation = async (userId) => {
    try {
        const response = await axios.get(
            `${MICROSERVICE1_URL}/api/users/${userId}`,
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return response.data.reputation || 0;
    } catch (err) {
        console.error('Erreur lors de la récupération de réputation:', err.message);
        return 0;
    }
};

