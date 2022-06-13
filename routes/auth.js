const express = require('express')
const Router = express.Router()
const AuthController = require('../controllers/AuthController')

Router.post('/api/auth/signin', AuthController.post_signin)

Router.post('/api/auth/signup', AuthController.post_signup)

export default { Router }