// eslint-disable-next-line @typescript-eslint/no-var-requires
import express from 'express'
import { post_signin, post_signup} from '../controllers/AuthController'
const Router = express.Router()

Router.post('/api/auth/signin', post_signin)

Router.post('/api/auth/signup', post_signup)

export default Router