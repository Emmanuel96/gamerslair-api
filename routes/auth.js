const express = require('express')
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken
const AuthController = require('../controllers/AuthController')

Router.post('/api/auth/signin', AuthController.post_signin)

Router.post('/api/auth/signup', AuthController.post_signup)

Router.get('/api/auth/fetch_all', authenticateToken, AuthController.fetchAll)

module.exports = Router