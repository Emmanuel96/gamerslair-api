import express from "express"
import tokens from '../middlewares/jwt'
import {
  create,
  fetchAll,
  fetchOne,
  fetchIncoming,
  fetchOutgoing,
  update,
  acceptOrReject,
  delete_challenge
} from '../controllers/ChallengeController'

const Router = express.Router()

// Router.get('/api/challenges/')
Router.post('/api/challenge/create', tokens.authenticateToken, create)

Router.get('/api/challenge/fetch_all', tokens.authenticateToken, fetchAll)

Router.get('/api/challenge/fetch/:id', tokens.authenticateToken, fetchOne)

Router.get('/api/challenge/fetch_incoming', tokens.authenticateToken, fetchIncoming)

Router.get('/api/challenge/fetch_outgoing', tokens.authenticateToken, fetchOutgoing)

Router.put('/api/challenge/update/:id', tokens.authenticateToken, update)

Router.delete('/api/challenge/delete/:id', tokens.authenticateToken, delete_challenge)

Router.put('/api/challenge/accept-or-reject/:id', tokens.authenticateToken, acceptOrReject)

export default Router