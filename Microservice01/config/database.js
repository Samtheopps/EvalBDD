const mongoose = require('mongoose')

async function connectDB(){
    try{
        const options = {
            dbName: process.env.DB_NAME
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, options)

        console.log(`Mongo DB connectée : ${conn.connection.host}`)
    }catch(error){
        console.error('Erreur de connection à Mongodb :')
        console.error(error.message)

        process.exit(1);
    }
}

async function closeDB(){
    try{
        await mongoose.connection.close();
        console.log('connection coupé avec la db')
    }catch(error){
        console.error("erreur lors de la fermeture : ", error)
    }
}

module.exports = {connectDB, closeDB}