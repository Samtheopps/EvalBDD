const observationService = require('../services/observationService');

// Analyse de texte simple pour extraire les mots-clés
const extractKeywords = (descriptions) => {
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'dans', 'pour', 'avec', 'est', 'a'];
    const words = {};

    descriptions.forEach(desc => {
        const tokens = desc.toLowerCase()
            .replace(/[.,!?;:]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.includes(word));

        tokens.forEach(word => {
            words[word] = (words[word] || 0) + 1;
        });
    });

    return Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
};

// Classification hiérarchique simple
const classifySpecies = (speciesWithObs) => {
    const families = {};

    speciesWithObs.forEach(species => {
        const firstLetter = species.name.charAt(0).toUpperCase();
        if (!families[firstLetter]) {
            families[firstLetter] = [];
        }
        families[firstLetter].push({
            name: species.name,
            observationCount: species.observationCount
        });
    });

    return families;
};

// GET /taxonomy/stats
exports.getTaxonomyStats = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const jwt = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        if (!jwt) {
            return res.status(401).json({ message: 'JWT requis' });
        }
        // Récupère toutes les espèces
        const species = await observationService.getAllSpecies(jwt);

        if (!species || species.length === 0) {
            return res.json({
                totalSpecies: 0,
                totalObservations: 0,
                averageObservationsPerSpecies: 0,
                speciesStats: [],
                keywords: [],
                classification: {}
            });
        }

        // Récupère les observations pour chaque espèce
        const speciesWithObs = await Promise.all(
            species.map(async (sp) => {
                const observations = await observationService.getObservationsBySpecies(sp._id, jwt);
                return {
                    ...sp,
                    observations: observations,
                    observationCount: observations.length
                };
            })
        );


        // Calcul des statistiques
        const totalObservations = speciesWithObs.reduce((sum, sp) => sum + sp.observationCount, 0);

        console.log(totalObservations);
        const averageObservations = totalObservations / species.length;

        // Extraction des mots-clés
        const allDescriptions = speciesWithObs
            .flatMap(sp => sp.observations)
            .filter(obs => obs.description)
            .map(obs => obs.description);
        const keywords = extractKeywords(allDescriptions);

        // Classification hiérarchique
        const classification = classifySpecies(speciesWithObs);

        // Statistiques par espèce
        const speciesStats = speciesWithObs.map(sp => ({
            id: sp._id,
            name: sp.name,
            observationCount: sp.observationCount,
            rarityScore: sp.rarityScore || 1,
            validatedCount: sp.observations.filter(o => o.status === 'validated').length,
            pendingCount: sp.observations.filter(o => o.status === 'pending').length,
            rejectedCount: sp.observations.filter(o => o.status === 'rejected').length
        })).sort((a, b) => b.observationCount - a.observationCount);

        res.json({
            totalSpecies: species.length,
            totalObservations,
            averageObservationsPerSpecies: parseFloat(averageObservations.toFixed(2)),
            speciesStats,
            keywords,
            classification
        });

    } catch (err) {
        console.error('Erreur lors du calcul des statistiques:', err);
        res.status(500).json({ message: err.message });
    }
};

