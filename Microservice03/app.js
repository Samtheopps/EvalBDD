require('dotenv').config({ path: './.env' });
require('dotenv').config({ path: '../.env' });

const express = require('express');
const { connectDB } = require('./config/database');
const taxonomyRoutes = require('./routes/taxonomyRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: `Taxonomy Service - Port ${PORT}`,
        endpoints: {
            stats: '/taxonomy/stats'
        }
    });
});

app.use('/api/taxonomy', taxonomyRoutes);

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Taxonomy Service démarré au port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur au démarrage du serveur :', error);
        process.exit(1);
    }
}

startServer();

