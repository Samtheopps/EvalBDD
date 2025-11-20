const mongoose = require('mongoose')
const User = require('../models/user')


const createUser = async (req,res)=>{
    console.log('Début de la création d\'un utilisateur');
    console.log('Données reçues dans req.body :', req.body);
    const startTime = Date.now();
    try {
        const { email, username, password, role, reputation } = req.body;
        console.log('Préparation du nouvel utilisateur avec :', { email, username, password, role, reputation });
        const user = new User({
            email,
            username,
            password,
            role,
            reputation
        });
        console.log('Instance User créée :', user);
        // Validation mongoose
        try {
            await user.validate();
            console.log('Validation mongoose OK');
        } catch (validationError) {
            console.error('Erreur de validation mongoose :', validationError);
        }
        const userSauvegarde = await user.save();
        console.log('Utilisateur sauvegardé en base :', userSauvegarde);
        const endTime = Date.now();
        console.log('Temps d\'exécution (ms) :', endTime - startTime);
        // On retire le mot de passe de la réponse
        const userObj = userSauvegarde.toObject();
        delete userObj.password;
        const response = {
            succes: true,
            message: 'User a été crée avec succes',
            data: userObj
        };
        console.log('Réponse envoyée au client :', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({
            succes: false,
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
}

const getAllUser = async(req,res)=>{
    try{
        const totalCountUser= await User.countDocuments()
        const user = await User.find().sort({ createdAt: -1 });
        const response ={
            success: true,
            count:user.length,
            totalCount:totalCountUser,
            data:user,
        }
        res.status(201).json(response)
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs",
            error: error.message
        });
    }
}
const getUserById = async(req,res)=>{
        try{
            const {id} = req.params;
            const user = await User.findById(id)

            if(!user){
                return res.status(404).json(
                    {
                        success:false,
                        message:"User non trouvée"
                    }
                );
            }
            res.status(201).json({
                success:true,
                data:user,
            })
        }catch(error){
            res.status(500).json({
                success: false,
                message: "Erreur lors de la récupération de l'utilisateur",
                error: error.message
            });
        }
}
const updateUser = async (req,res)=>{
            try{
                const {id} = req.params

                const user = await User.findByIdAndUpdate(
                    id,
                    req.body,
                    {
                        new:true,
                        runValidators:true
                    }
                )
                if(!user){
                    return res.status(404).json(
                        {
                            success:false,
                            message:"User non trouvée"
                        }
                    );
                }
                res.status(201).json({
                    success:true,
                    message:"User mis a jour avec success",
                    data:user,
                })
            }catch(error){
                res.status(500).json({
                    success: false,
                    message: "Erreur lors de la mise à jour de l'utilisateur",
                    error: error.message
                });
            }
}
const deleteUser = async(req,res) =>{
                try{
                    const {id} = req.params;

                    const user = await User.findByIdAndDelete(id)

                    if(!user){
                        return res.status(404).json({
                            success:false,
                            message:"user n'a pas été trouvé",
                        });
                    }

                    res.status(200).json({
                        success:true,
                        message:"user a été supprimé avec succès",
                        data:user,
                    });

                }catch(error){
                    res.status(500).json({
                        success: false,
                        message: "Erreur lors de la suppression de l'utilisateur",
                        error: error.message
                    });
                }

}


module.exports = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}
