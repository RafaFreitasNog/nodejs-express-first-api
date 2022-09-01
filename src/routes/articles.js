const express = require('express')
const router = express.Router()

const Articles = require('../models/articles')

router.get('/', (req, res) => {
    console.log('Olá')
    res.send('Articles')
})

module.exports = router; 
