const express = require('express')
const app = express()
const articlesRouter = require('./src/routes/articles')
const columnistsRouter = require('./src/routes/columnists')
require('./config/database')

app.listen('3000')

// midlewares
    // transforms everything into JSON format
app.use(express.json())
    // uses the routers
app.use('/articles', articlesRouter)
app.use('/columnists', columnistsRouter)
