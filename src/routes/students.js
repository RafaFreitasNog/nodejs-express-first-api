const express = require('express')
const router = express.Router()

router.get('/studentsR', (req, res) => {
    console.log('Olá')
    res.send('Olá tb')
})

module.exports = router; 
