const express = require('express');
const router = express.Router();

// IMporting model Schema
const Columnists = require('../models/columnists')



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
router.post('/register', async (req, res) => {
    try {
        let {name, email, password} = req.body;
        let columnist = await Columnists.create({name, email, password})
        res.status(200).send(columnist)
    } catch (error) {
        res.status(500).json({error: "Error creating new columnist"})
    }
})

module.exports = router