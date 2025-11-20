require('dotenv').config({ path: './.env' }); // .env dans le dossier courant
require('dotenv').config({ path: '../.env' }); // .env à l'extérieur


const express = require('express')
const {connectDB} = require('./config/database')
const observationRoutes = require('./routes/observationRoutes')
const speciesRoutes = require('./routes/speciesRoutes')

const app = express()

const PORT = process.env.PORT|| 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: `Bienvenue sur l'API exposée au port ${PORT}`
    })
})

app.use('/api/observations', observationRoutes)
app.use('/api/species', speciesRoutes)

async function startServer() {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Le serveur a bien démarré au port localhost:${PORT}, youpi, hourra.`)
        })
    } catch (error) {
        console.error('Erreur au démarrage du serveur :', error);
        process.exit(1);
    }
}


startServer()
