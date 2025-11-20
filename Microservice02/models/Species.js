const mongoose = require('mongoose');

const speciesSchema = mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "L'ID de l'auteur est obligatoire"],
    },
    name: {
        type: String,
        required: [true, "Le nom de l'espèce est obligatoire"],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

});

const Species = mongoose.model('Species', speciesSchema);

module.exports = Species;