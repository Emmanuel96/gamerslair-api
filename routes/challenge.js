const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const ChallengeController = require('../controllers/ChallengeController')

// Router.get('/api/challenges/')
Router.post('/api/challenge/create', authenticateToken, ChallengeController.create)
Router.get('/api/challenge/fetch_all', authenticateToken, ChallengeController.fetchAll)
Router.get('/api/challenge/fetch/:id', authenticateToken, ChallengeController.fetchOne)
Router.get('/api/challenge/fetch_incoming', authenticateToken, ChallengeController.fetchIncoming)
Router.get('/api/challenge/fetch_outgoing', authenticateToken, ChallengeController.fetchOutgoing)
Router.put('/api/challenge/update/:id', authenticateToken, ChallengeController.update)
Router.delete('/api/challenge/delete/:id', authenticateToken, ChallengeController.delete)

Router.put('/api/challenge/accept-or-reject/:id', authenticateToken, ChallengeController.acceptOrReject)
module.exports = Router