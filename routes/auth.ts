// eslint-disable-next-line @typescript-eslint/no-var-requires
import express from 'express'
import { post_signin, post_signup, fetchAll } from '../controllers/AuthController'
import tokens from '../middlewares/jwt';

const Router = express.Router()

Router.post('/api/auth/signin', post_signin)

Router.post('/api/auth/signup', post_signup)

Router.get('/api/auth/fetch_all', tokens.authenticateToken, fetchAll)

export default Router