const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log('Olá')
    res.send('Articles')
})

module.exports = router; 
