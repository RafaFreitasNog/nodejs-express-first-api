const express = require('express')
const app = express()
const articlesRouter = require('./src/routes/articles')
const columnistsRouter = require('./src/routes/columnists')
const usersRouter = require('./src/routes/users')
require('./config/database')
const cors = require('cors')

app.listen('3001')

// midlewares
    // transforms everything into JSON format
app.use(express.json());
app.use(cors());

    // uses the routers
app.use('/articles', articlesRouter);
app.use('/columnists', columnistsRouter);
app.use('/users', usersRouter);
