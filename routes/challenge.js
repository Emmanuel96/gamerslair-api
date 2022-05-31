const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const ChallengeController = require('../controllers/ChallengeController')

// Router.get('/api/challenges/')
Router.post('/api/challenge/create', authenticateToken, ChallengeController.create)
Router.get('/api/challenge/fetch_all', authenticateToken, ChallengeController.fetchAll)
Router.get('/api/challenge/fetch/:id', authenticateToken, ChallengeController.fetchOne)
Router.get('/api/challenge/fetch_incoming/:user_id', authenticateToken, ChallengeController.fetchIncoming)
Router.get('/api/challenge/fetch_outgoing/:user_id', authenticateToken, ChallengeController.fetchOutgoing)
Router.put('/api/challenge/update/:id', authenticateToken, ChallengeController.update)
Router.delete('/api/challenge/delete/:id', authenticateToken, ChallengeController.delete)
module.exports = Router