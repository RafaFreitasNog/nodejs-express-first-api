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
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

// Encrypt password
columnistsSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password ')) {
        try {
            const hash = await bcrypt.hash(this.password, 10)
            this.password = hash
            next()
        } catch (error) {
            next(error)
        }
    }
})

module.exports = mongoose.model('Columnists', columnistsSchema)