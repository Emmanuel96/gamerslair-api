const express = require("express")

const Router = express.Router()

Router.get('/', (req, res, next) => {
  res.send(`<h1>App root</h1>`)
  next()
})

module.exports = Router