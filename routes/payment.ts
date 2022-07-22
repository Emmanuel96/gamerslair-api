import express from "express"
import tokens from '../middlewares/jwt'

const Router = express.Router()
import { create_payment_intent, updateUserAccount } from '../controllers/PaymentController'

Router.post('/api/payment/create_payment_intent', tokens.authenticateToken, create_payment_intent);

Router.post('/api/payment/update_account', tokens.authenticateToken, updateUserAccount);

export default Router