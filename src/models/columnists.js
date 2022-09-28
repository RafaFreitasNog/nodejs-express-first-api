const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const columnistsSchema = mongoose.Schema ({
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
        immutable: true,
        default: () => Date.now()
    },
    updated_at: {
        type: Date,
        default: () => Date.now()
    },
    columnist: {
        type: Boolean,
        default: true,
        immutable: true
    }
})

// Encrypt password
columnistsSchema.pre('save', async function (next) {
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
columnistsSchema.pre('save', async function (next) {
    this.updated_at = Date.now()
    next()
})

module.exports = mongoose.model('Columnists', columnistsSchema)