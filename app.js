require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const DB = require("./database/mongodb")
const indexRouter = require('./routes/index')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(indexRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app