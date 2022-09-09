const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        required: true,
        select: false
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
        ref: 'Articles'
    }]

})

// Encrypt password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        try {
            const hash = await bcrypt.hash(this.password, 10)
            this.password = hash
            next()
        } catch (error) {
            next(error)
        }
    }
})

// Updates the updated_at field 
userSchema.pre('save', async function (next) {
    this.updated_at = Date.now()
    next()
})

module.exports = mongoose.model('User', userSchema)