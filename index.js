const express = require('express')
const app = express()
const studentsRouter = require('./src/routes/students')
require('./config/database')

app.listen('3000')

let students = []

// midlewares
// transforms everything into JSON format
app.use(express.json())

// uses the routers
app.use(studentsRouter)

// GET routes
app.route('/').get((req, res) => {
    res.send("Hello, World! This is the base route, use /students to GET, POST, PUT and DELETE students.")
})

app.route('/students').get((req, res) => {
    res.send(students)
})

// POST routes
app.route('/students').post((req, res) => {
    students.push(req.body.name)
    res.send(`"${req.body.name}" was added to "students"`)
})

// PUT routes
app.route('/students/:number').put((req, res) => {
    students[req.params.number] = req.body.name
    res.send(`"${req.body.name}" is the student ${req.params.number} new name`)
})

// DELETE routes
app.route('/students/:number').delete((req, res) => {
    students.splice(req.params.number, 1)
    res.send(`student ${req.params.number} was removed`)
})