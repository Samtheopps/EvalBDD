const mongoose = require('mongoose');

const observationSchema = mongoose.Schema({
    speciesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Species',
        required: [true, "L'ID de l'espèce est obligatoire"],
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "L'ID de l'auteur est obligatoire"],
    },
    description: {
        type: String,
        required: [true, "La description est obligatoire"],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'validated', 'rejected'],
        default: 'pending',
    },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    validatedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Validation personnalisée
observationSchema.pre('save', function(next) {
    if (this.status === 'pending') {
        this.validatedBy = null;
        this.validatedAt = null;
    }
    next();
});

const Observation = mongoose.model('Observation', observationSchema);

module.exports = Observation;
