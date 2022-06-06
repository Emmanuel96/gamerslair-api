const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const GameController = require('../controllers/GameController')

Router.get('/api/game/fetch_ongoing', authenticateToken, GameController.fetchOngoing)
Router.post('/api/game/report/:id', authenticateToken, GameController.report)
Router.post('/api/game/verify/:id', authenticateToken, GameController.verify)

module.exports = Router