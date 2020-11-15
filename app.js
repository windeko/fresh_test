require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const helper = require('./helpers/helper')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()

app.use(fileUpload({
    createParentPath: true,
    safeFileNames: true,
    preserveExtension: 4,
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true
}))

app.use(morgan('dev'))

app.get('', (req, res) => (res.send(
    'Welcome, stranger'
)))

const fileServerRouter = require('./src/fileserver/fileserverRouter')

app.use(express.json())

app.use('/fileServer', fileServerRouter)

// ERROR HANDLING
app.use(function (err, req, res, next) {
    if (!err.status) err.status = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.status).send({ error: err.message }) // All HTTP requests must have a response, so let's send back an error with its status code and message
})

// HELPER
global.helper = helper

// GLOBALS
global.rootDir = __dirname

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Express starts on', port, 'port'))
