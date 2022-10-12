const express = require('express')
const router = express.Router()

const isAuth = require('../middlewares/auth')
const isColumnist = require('../middlewares/columnistAuth')
const articles = require('../models/articles')

const Categories = require('../models/categories')

// GET Routes
// get all
router.get('/', isAuth, async (req, res) => {
  try {
    let categories = await Categories.find({})
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json(error)
  }
})

// POST Routes
router.post('/', isColumnist, async (req, res) => {
  try {
    let { name } = req.body
    let categorie = await Categories.create({
      name: name
    })
    res.status(200).json(categorie)
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router; 