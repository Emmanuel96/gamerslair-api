// eslint-disable-next-line @typescript-eslint/no-var-requires
import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import "./database/db"

import authRouter from './routes/auth';
import testRouter from './routes/testRoute';
import challengeRouter from './routes/challenge';
import gameRouter from './routes/game';
import paymentRouter from './routes/payment';
import { unknownEndpoint, errorHandler, } from './middlewares/error';

const app: any = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(authRouter)
app.use(testRouter)
app.use(challengeRouter)
app.use(gameRouter)
app.use(paymentRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app 