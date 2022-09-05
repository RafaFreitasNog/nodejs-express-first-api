const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Columnist'
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }, 
    created_at: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updated_at: {
        type: Date,
        default: () => Date.now()
    }
})

// Updates the updated_at field 
columnistsSchema.pre('save', async function (next) {
    this.updated_at = Date.now()
    next()
})

module.exports = mongoose.model('Articles', articleSchema);