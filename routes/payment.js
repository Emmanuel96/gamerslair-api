const express = require("express")
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

const PaymentController = require('../controllers/PaymentController')

Router.post('/api/payment/create_payment_intent', authenticateToken, PaymentController.create_payment_intent);
Router.post('/api/payment/update_account', authenticateToken, PaymentController.updateUserAccount);

module.exports = Router