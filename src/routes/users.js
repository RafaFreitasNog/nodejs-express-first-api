const express = require('express');
const router = express.Router();

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
router.post('/register', async (req, res) => {
    try {
        let {name, email, password} = req.body;
        let user = await Users.create({name, email, password})
        res.status(200).send(user)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router