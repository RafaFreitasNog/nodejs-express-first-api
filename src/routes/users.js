const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

// IMporting model Schema
const Users = require('../models/users')



// GET Routes
// GET All
router.get('/', async (req, res) => {
    try {
        let users = await Users.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET by id
router.get('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let user = await Users.findById(id)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})



// PUT Routes
router.put('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let {name, email, password} = req.body;
        let user = await Users.findById(id)
        Object.assign(user, req.body)
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})



// DELETE Routes
router.delete('/:id', async (req, res) => {
    try {
        let { id } = req.params
        let user = await Users.findByIdAndRemove(id)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})



// POST Routes
// REGISTER
router.post('/register', async (req, res) => {
    try {
        let {name, email, password} = req.body;
        let user = await Users.create({name, email, password})
        res.status(200).send(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Login
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    const user = await Users.findOne({email})
    try {
        if (!user) {
            return res.status(400).send({error: "User not found"})
        }

        const same = await bcrypt.compare(password, user.password)

        if (same == false) {
            return res.status(400).send({error: "Incorrect password"})
        }
        
        if (same) {
            const token = jwt.sign({ email }, secret, {expiresIn: '10d'})

            user.password = undefined
            res.send({ user, token })
        }

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router