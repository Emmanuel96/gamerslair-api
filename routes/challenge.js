const express = require("express")
const Router = express.Router()

const ChallengeController = require('../controllers/ChallengeController')

// Router.get('/api/challenges/')
Router.post('/api/challenge/create', ChallengeController.create)
Router.get('/api/challenge/fetch_all', ChallengeController.fetchAll)
Router.get('/api/challenge/fetch/:id', ChallengeController.fetchOne)
Router.get('/api/challenge/fetch_incoming/:user_id', ChallengeController.fetchIncoming)
Router.get('/api/challenge/fetch_outgoing/:user_id', ChallengeController.fetchOutgoing)
Router.put('/api/challenge/update/:id', ChallengeController.update)
Router.delete('/api/challenge/delete/:id', ChallengeController.delete)
module.exports = Router