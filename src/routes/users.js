const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

// Authentication middlewares
const isColumnist = require('../middlewares/columnistAuth')
const isUser = require('../middlewares/userAuth')
const isAuth = require('../middlewares/auth')

// Importing model Schema
const Users = require('../models/users')
const Columnists = require('../models/columnists')
const Articles = require('../models/articles')



// GET Routes
// GET All
router.get('/', isAuth, async (req, res) => {
    try {
        let users = await Users.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET Favorites
router.get('/favorites', isUser, async (req, res) => {
    try {
        let { favorites } = req.user
        const favoriteArticles = await Articles.find({_id: { $in: favorites}})
        res.status(200).send(favoriteArticles)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET by id
router.get('/:id', isAuth, async (req, res) => {
    try {
        let { id } = req.params
        let user = await Users.findById(id)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})



// PUT Routes
// Add Article to Favorites
router.put('/favorites/add/:id', isUser, async (req, res) => {
    try {
        let { id } = req.params
        let { favorites } = req.user
        const checkIfItsAlreadyFavorite = await favorites.includes(id)
        if (checkIfItsAlreadyFavorite) {
            res.status(400).send({error: 'already in your favorites'})
        } else {
            const checkIfArticleExists = await Articles.findById(id)
            if (checkIfArticleExists) {
                const updatedUser = await Users.findByIdAndUpdate(req.user._id, {
                    $push: {
                        favorites: id,
                    }
                }, { new: true })
                res.status(200).send(updatedUser)
            } else {
                res.status(404).send({error: `No article matches the id value provided`})
            }
        }
    } catch (error) {
        res.status(404).send({error: `No article matches the id value provided`})
    }
})

// Remove Articles from Favorites
router.put('/favorites/remove/:id', isUser, async (req, res) => {
    try {
        let { id } = req.params
        let { favorites } = req.user
        const checkIfArticleExists = await Articles.findById(id)
        await Articles.find()
        if (checkIfArticleExists) {
            const checkIfItsFavorite = await favorites.includes(id)
            if (checkIfItsFavorite) {
                const updatedUser = await Users.findByIdAndUpdate(req.user._id, {
                    $pull: {
                        favorites: id,
                    }
                }, { new: true })
                res.status(200).send(updatedUser)
            } else {
                res.status(404).send({error: `The article is not in your favorites`})
            }
        } else {
            res.status(404).send({error: `No article matches the id value provided`})
        }

    } catch (error) {
        res.status(404).send({error: `No article matches the id value provided`})
    }
})

// Edit Personal Info
router.put('/:id', isUser, async (req, res) => {
    try {
        let { id } = req.params
        let {name, email, password} = req.body;
        let user = await Users.findById(id)
        const checkIfSelf = await isSelf(req.user, user)
        if (checkIfSelf) {
            Object.assign(user, req.body)
            await user.save()
            user.password = undefined
            res.send(user)
        } else {
            res.status(401).send({error: `Permission denied, not your account`})
        }
    } catch (error) {
        res.status(500).send(error)
    }
})



// DELETE Routes
router.delete('/:id', isUser, async (req, res) => {
    try {
        let { id } = req.params
        let findUser = await Users.findById(id)
        const checkIfSelf = await isSelf(req.user, findUser)
        if (checkIfSelf) {
            let removedUser = await Users.findByIdAndRemove(id)
            res.send(removedUser)
        } else {
            res.status(401).send({error: `Permission denied, not your account`})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})



// POST Routes
// REGISTER
router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const isThere = await isEmailAlreadyUsed(email)
        if (isThere) {
            res.status(401).json({error: "Error creating new user, email already in use"})
        } else {            
            const user = await Users.create({name, email, password})
            user.password = undefined
            res.status(200).send(user)
        }
    } catch (error) {
        res.status(500).json({error: "Unexpected error creating new user"})
    }
})

// Login
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    const user = await Users.findOne({email}).select('+password')
    try {
        if (!user) {
            return res.status(400).json({error: "No user found with this e-mail"})
        }

        const same = await bcrypt.compare(password, user.password)

        if (same == false) {
            return res.status(400).json({error: "Incorrect password"})
        }
        
        if (same) {
            const token = jwt.sign({ email }, secret, {expiresIn: '10d'})

            user.password = undefined
            res.send({ user, token })
        }

    } catch (error) {
        res.status(500).json({error: "Unexpected error"})
    }
})

const isEmailAlreadyUsed = async (email) => {
    const isThereColumnist = await Columnists.findOne({email: email})
    const isThereUser = await Users.findOne({email: email})
    if (!isThereColumnist && !isThereUser) {
        return false
    } else {
        return true
    }
}

const isSelf = async (userWhoRequested, userToUpdate) => {
    if (JSON.stringify(userWhoRequested._id) == JSON.stringify(userToUpdate._id)) {
        return true
    } else {
        return false
    }
}

module.exports = router