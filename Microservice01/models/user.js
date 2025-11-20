const mongoose = require('mongoose')
require('mongoose-type-email');

const userSchema = mongoose.Schema({
        email: {
            type: mongoose.SchemaTypes.Email,
            required: [true, "l'email est obligatoire"],
        },
        username: {
            type: String,
            required: [true, "nom d'utilisateur vide ?"],
            trim: true,
            minLength: [3, "le nom d'utilisateur doit contenir au moins 3 caractère"],
            maxLength: [15, "le nom d'utilisateur doit contenir au maximum 15 caractère"]
        },
        password: {
            type: String,
            required: [true, "mot de passe vide ?"]
        },
        role: {
            type: String,
            required:true,
            default:'USER',
            enum:['ADMIN','EXPERT','USER']
        },
        reputation: {
            type: Number,
            min: [0, "une réputaion ne peut pas être négatif"],
            max: [5, "une réputaion ne peut pas dépasser 5"]
        }
    },
    {
        virtuals: true,
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.__v
                return ret;
            }
        }
    }
);

const User = mongoose.model('User',userSchema)

module.exports = User


