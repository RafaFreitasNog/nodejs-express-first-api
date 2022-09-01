const { json } = require('express')
const express = require('express')
const router = express.Router()

// Importing model schema
const Articles = require('../models/articles')

// GET Routes

    // GET all
router.get('/', async (req, res) => {
    try {
        let articles = await Articles.find({})
        res.send(articles)
    } catch (error) {
        res.status(400).send(error)
    }
})

    // GET by id
router.get('/:id', async (req, res) => {
    try {
        let article = await Articles.findById(req.params.id)
        res.send(article)
    } catch (error) {
        res.status(400).send(error)
    }
})



// POST Routes
router.post('/', async (req, res) => {
    try {
        let article = await Articles.create(req.body)
        res.status(200).send(article)
    } catch (error) {
        res.status(400).send(error)
    }
})



// PUT Routes
router.put('/:id', async (req, res) => {
    try {
        let article = await Articles.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.send(article)
    } catch (error) {
        res.status(400).send(error)
    }
})



// DELETE Routes
router.delete('/:id', async (req, res) => {
    try {
        let article = await Articles.findByIdAndRemove(req.params.id)
        res.send(article)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router; 
