import { Request, Response } from "express"

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: Error, request: Request, response: Response, next?: any): Response | void => {
  console.error(error.message)
  if(error.name === 'CastError'){
    response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

export { unknownEndpoint, errorHandler, }