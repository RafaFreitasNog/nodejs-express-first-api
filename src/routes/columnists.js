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
const Columnists = require('../models/columnists')
const Users = require('../models/users')



// GET Routes
// GET All
router.get('/', async (req, res) => {
    try {
        let columnists = await Columnists.find({})
        res.status(200).send(columnists)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET by id
router.get('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let columnist = await Columnists.findById(id)
        res.send(columnist)
    } catch (error) {
        res.status(400).send(error)
    }
})



// PUT Routes
router.put('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let {name, email, password} = req.body;
        let columnist = await Columnists.findById(id)
        Object.assign(columnist, req.body)
        await columnist.save()
        columnist.password = undefined
        res.send(columnist)
    } catch (error) {
        res.status(400).send(error)
    }
})



// DELETE Routes
router.delete('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let columnist = await Columnists.findByIdAndRemove(id)
        res.send(columnist)
    } catch (error) {
        res.status(400).send(error)
    }
})



// POST Routes
// Register
router.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const isThere = await isEmailAlreadyUsed(email)
        if (isThere) {
            res.status(401).json({error: "Error creating new columnist, email already in use"})
        } else {
            const columnist = await Columnists.create({name, email, password})
            res.status(200).send(columnist)
        }
    } catch (error) {
        res.status(500).json({error: "Error creating new columnist"})
    }
})

// Login
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    const columnist = await Columnists.findOne({email}).select('+password')
    try {
        if (!columnist) {
            return res.status(400).send({error: "User not found"})
        }

        const same = await bcrypt.compare(password, columnist.password)

        if (same == false) {
            return res.status(400).send({error: "Incorrect password"})
        }
        
        if (same) {
            const token = jwt.sign({ email }, secret, {expiresIn: '10d'})

            columnist.password = undefined
            res.send({ columnist, token })
        }

    } catch (error) {
        res.status(500).send(error)
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

module.exports = router