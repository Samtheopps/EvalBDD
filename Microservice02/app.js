require('dotenv').config({ path: './.env' }); // .env dans le dossier courant
require('dotenv').config({ path: '../.env' }); // .env à l'extérieur


const express = require('express')
const {connectDB} = require('./config/database')
const observationRoutes = require('./routes/observationRoutes')
const speciesRoutes = require('./routes/speciesRoutes')
const authRoutes = require('./routes/authRoutes')
const moderationRoutes = require('./routes/moderationRoutes')

const app = express()

const PORT = process.env.PORT|| 3001

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: `Bienvenue sur l'API exposée au port ${PORT}`
    })
})

app.use('/api/observations', observationRoutes)
app.use('/api/species', speciesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', moderationRoutes)
app.use('/api/expert', moderationRoutes)

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
