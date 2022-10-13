const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Columnist',
        required: true,
        index: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        index: true
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
articleSchema.pre('save', async function (next) {
    this.updated_at = Date.now()
    next()
})

// Creates a 'text' index with the title, subtitile and text fields
articleSchema.index({'title': 'text', 'subtitle': 'text', 'text': 'text'});

articleSchema.index({author: 1});

module.exports = mongoose.model('Articles', articleSchema);