import express from "express"
import tokens from '../middlewares/jwt';
import { fetchOngoing, report, verify, fetch_profile } from '../controllers/GameController';

const Router = express.Router()

Router.get('/api/game/fetch_ongoing', tokens.authenticateToken, fetchOngoing)

Router.post('/api/game/report/:id', tokens.authenticateToken, report)

Router.post('/api/game/verify/:id', tokens.authenticateToken, verify)

Router.get('/api/game/fetch_profile/', tokens.authenticateToken, fetch_profile)

export default Router