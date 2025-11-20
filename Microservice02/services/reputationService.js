// Microservice02/services/reputationService.js
const axios = require('axios');

const MICROSERVICE1_URL = process.env.MICROSERVICE1_URL || 'http://localhost:3000';

exports.addReputation = async (userId, points, reason, jwt) => {
    try {
        const response = await axios.post(
            `${MICROSERVICE1_URL}/api/users/${userId}/reputation`,
            { points, reason },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Erreur lors de l\'ajout de réputation:', err.message);
        throw err;
    }
};

exports.getReputation = async (userId, jwt) => {
    try {
        const response = await axios.get(
            `${MICROSERVICE1_URL}/api/users/${userId}/reputation`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                }
            }
        );
        return response.data.reputation || 0;
    } catch (err) {
        console.error('Erreur lors de la récupération de réputation:', err.message);
        return 0;
    }
};
