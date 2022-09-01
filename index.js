const express = require('express')
const app = express()
const studentsRouter = require('./src/routes/articles')
require('./config/database')

app.listen('3000')

// midlewares
    // transforms everything into JSON format
app.use(express.json())
    // uses the routers
app.use('/articles', studentsRouter)
