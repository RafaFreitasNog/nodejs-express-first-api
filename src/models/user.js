const mongoose = require('mongoose')

const userSchema = mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: () => Date.now()
    },
    updated_at: {
        type: Date,
        default: () => Date.now()
    },
    favorites: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Columnist'
    }]

})

module.esports = mongoose.model('User', userSchema)