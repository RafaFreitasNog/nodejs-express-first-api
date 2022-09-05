const express = require('express');
const router = express.Router();

// IMporting model Schema
const Columnists = require('../models/columnists')


// POST Routes
router.post('/', async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const columnist = await Columnists.create({name, email, password})
        res.status(200).send(columnist)
    } catch (error) {
        res.status(500).json({error: "Error creating new columnist"})
    }
})

module.exports = router