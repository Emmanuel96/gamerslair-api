require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const DB = require("./database/mongodb")
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const testRouter = require('./routes/test')
const challengeRouter = require('./routes/challenge')
const errorMiddleware = require('./middlewares/error')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(indexRouter)
app.use(authRouter)
app.use(testRouter)
app.use(challengeRouter)

app.use(errorMiddleware.unknownEndpoint)
app.use(errorMiddleware.errorHandler)

module.exports = app