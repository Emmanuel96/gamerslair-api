// eslint-disable-next-line @typescript-eslint/no-var-requires
import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
const app = express()
import cors from 'cors';
import morgan from 'morgan';

import "./database/config"

import authRouter from './routes/auth';
import testRouter from './routes/testRoute';
import { unknownEndpoint, errorHandler, } from './middlewares/error';

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(authRouter)
app.use(testRouter)


app.use(unknownEndpoint)
app.use(errorHandler)

export default app 