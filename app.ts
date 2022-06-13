require('dotenv').config()

import express from 'express';
const app = express()
import cors from 'cors';
import morgan from 'morgan';

require("./database/config");

import authRouter from './routes/auth';
import testRouter from './routes/testRoute';
import errorMiddleware from './middlewares/error';

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))

app.use(authRouter)
app.use(testRouter)


app.use(errorMiddleware.unknownEndpoint)
app.use(errorMiddleware.errorHandler)

export default { app }