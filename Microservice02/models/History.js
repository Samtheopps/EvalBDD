const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    targetType: {
        type: String,
        enum: ['observation', 'species', 'user'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        enum: ['created', 'validated', 'rejected', 'deleted', 'restored'],
        required: true
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    performedByRole: {
        type: String,
        enum: ['USER', 'EXPERT', 'ADMIN']
    },
    details: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History;

