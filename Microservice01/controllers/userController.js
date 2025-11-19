const mongoose = require('mongoose')
const User = require('../models/user')


const createUser = async (req,res)=>{
    try {
        const { email, username, password, role, reputation } = req.body;
        const user = new User({
            email,
            username,
            password,
            role,
            reputation
        });
        const userSauvegarde = await user.save();
        res.status(201).json({
            succes: true,
            message: 'User a été crée avec succes',
            data: userSauvegarde
        });
    } catch (error) {
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
