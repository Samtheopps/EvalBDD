require('dotenv').config();

const express = require('express')

const {connectDB,closeDB} = require('./config/database')

const userRoutes = require('./routes/user')

const app = express()

const PORT = process.env.PORT|| 3000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        message: `Bienvenue sur l'API exposée au port ${PORT}`
    })
})

app.use('/api/users', userRoutes)

async function startServer() {
    try {
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Le serveur a bien démarré au port ${PORT}, youpi, hourra.`)
        })
    } catch (error) {
        console.error('Erreur au démarrage du serveur :', error);
        process.exit(1);
    }
}


startServer()
