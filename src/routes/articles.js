const express = require('express')
const router = express.Router()

// Authentication middlewares
const isColumnist = require('../middlewares/columnistAuth')
const isUser = require('../middlewares/userAuth')
const isAuth = require('../middlewares/auth')

// Importing model schema
const Articles = require('../models/articles')
const { default: mongoose } = require('mongoose')

// GET Routes

// GET All
router.get('/', isAuth, async (req, res) => {
    try {
        let articles = await Articles.aggregate([
            {
                $lookup: {
                    from: 'columnists',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            }
        ])
        res.send(articles)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Search Articles
router.get('/search', isAuth, async (req, res) => {
    try {
        let { query } = req.query
        let matchedArticles = await Articles.find({ $text: { $search: query }})
        res.status(200).send(matchedArticles)
    } catch (error) {
        res.status(400).send({error})
    }
})

// GET by Id
router.get('/:id', isAuth, async (req, res) => {
    try {
        const id = req.params.id
        let article = await Articles.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'columnists',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            }
        ])
        res.send(article)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET by Columnist
router.get('/writtenby/:columnistid', isAuth, async (req, res) => {
    try {
        let { columnistid } = req.params
        let articles = await Articles.find({author: columnistid})
        res.send(articles)
    } catch (error) {
        res.status(400).send(error)
    }
})



// POST Routes
router.post('/', isColumnist, async (req, res) => {
    try {
        let { title, subtitle, text } = req.body
        let columnist = req.columnist
        let article = await Articles.create({
            author: columnist._id,
            title: title,
            subtitle: subtitle,
            text: text
        })
        res.status(200).send({article, columnist})
    } catch (error) {
        res.status(400).send(error)
    }
})



// PUT Routes
router.put('/:id', isColumnist, async (req, res) => {
    try {
        let { id } = req.params
        let article = await Articles.findById(id)
        if (isOwner(req.columnist, article)) {            
            Object.assign(article, req.body)
            await article.save()
            res.send(article)
        } else {
            res.status(401).send({error: `You don't have this permission`})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})



// DELETE Routes
router.delete('/:id', isColumnist, async (req, res) => {
    try {
        let { id } = req.params
        let findArticle = await Articles.findById(id)
        if (isOwner(req.columnist, findArticle)) {
            let removedArticle = await Articles.findByIdAndRemove(id)
            res.send(removedArticle)
        } else {
            res.status(401).send({error: `You don't have this permission, not your article`})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})



const isOwner = (columnist, article) => {
    if (JSON.stringify(columnist._id) == JSON.stringify(article.author._id)) {
        return true
    } else {
        return false
    }
}

module.exports = router; 
