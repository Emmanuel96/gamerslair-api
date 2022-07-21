const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const PaymentController = require('../controllers/PaymentController')

Router.post('/api/payment/create-payment-intent', authenticateToken, PaymentController.create_payment_intent);

module.exports = Router