const axios = require('axios');

const MICROSERVICE2_URL = process.env.MICROSERVICE2_URL || 'http://localhost:3001';

// Récupère toutes les espèces
exports.getAllSpecies = async (jwt) => {
    try {
        const response = await axios.get(`${MICROSERVICE2_URL}/api/species`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la récupération des espèces:', err.message);
        return [];
    }
};

// Récupère toutes les observations d'une espèce
exports.getObservationsBySpecies = async (speciesId, jwt) => {
    try {
        const response = await axios.get(`${MICROSERVICE2_URL}/api/species/${speciesId}/observations`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la récupération des observations:', err.message);
        return [];
    }
};

