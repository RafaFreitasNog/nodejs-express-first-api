const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/articles-db', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Conectado com MongoDb"))
    .catch(err => console.error(err))