const express = require('express')
const mongoose = require('mongoose')
const bodyParse = require('body-parser')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
const port = 3000
const dbConnection = process.env.DB_CONNECTION_URI

// Middleware
app.use(bodyParser.json())

// Mongodb Connection
mongoose.connect(dbConnection)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes
const bookRouters = require('./routes/books')
const authRouters = require('./routes/auth')
app.use('/books', bookRouters)
app.use('/auth', authRouters)

app.get('/', (req,res) => {
    res.send('Welcome to book api')
})

app.listen(port, () => {
    console.log('Node server is running')
})