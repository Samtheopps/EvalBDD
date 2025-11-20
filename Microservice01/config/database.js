const mongoose = require('mongoose')

async function connectDB(){
    console.log('Début de la connexion à MongoDB...')
    try{
        const options = {
            dbName: process.env.DB_NAME
        }
        console.log('Options de connexion :', options)
        console.log('URI MongoDB :', process.env.MONGODB_URI)
        const conn = await mongoose.connect(process.env.MONGODB_URI, options)
        console.log('Objet de connexion retourné :', conn)
        console.log(`Mongo DB connectée : ${conn.connection.host}`)
    }catch(error){
        console.error('Erreur de connection à Mongodb :')
        console.error('Stack :', error.stack)
        console.error('Message :', error.message)
        process.exit(1);
    }
}

async function closeDB(){
    console.log('Début de la fermeture de la connexion MongoDB...')
    try{
        await mongoose.connection.close();
        console.log('connection coupé avec la db')
    }catch(error){
        console.error("erreur lors de la fermeture : ", error)
        console.error('Stack :', error.stack)
        console.error('Message :', error.message)
    }
}

module.exports = {connectDB, closeDB}