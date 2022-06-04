require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const DB = require("./database/config")
const authRouter = require('./routes/auth')
const testRouter = require('./routes/testRoute')
const errorMiddleware = require('./middlewares/error')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(authRouter)
app.use(testRouter)

app.use(errorMiddleware.unknownEndpoint)
app.use(errorMiddleware.errorHandler)

module.exports = app