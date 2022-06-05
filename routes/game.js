const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const GameController = require('../controllers/GameController')

Router.get('/api/game/fetch_ongoing', authenticateToken, GameController.fetchOngoing)

module.exports = Router