const mongoose = require('mongoose');

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("La variable d'environnement MONGODB_URI est manquante.");
        }

        const options = {
            dbName: process.env.DB_NAME || 'Aquaman'
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`MongoDB connecté : ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error.message);
        process.exit(1);
    }
}

async function closeDB() {
    try {
        await mongoose.connection.close();
        console.log('Connexion à la base de données fermée.');
    } catch (error) {
        console.error("Erreur lors de la fermeture de la connexion :", error.message);
        process.exit(1);
    }
}

module.exports = { connectDB, closeDB };
