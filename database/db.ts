import { connect } from 'mongoose'
import logger from '../utils/logger'
import config from '../utils/config'

async function connectDB() {
  try{
    logger.info("Connecting to mongoDB...")
    connect(config.URI)
    logger.info("Successfully connected to MongoDB!")
  }
  catch(error: any){
    console.log("Failed to connect to MongoDB: ", error.message)
  }
}

connectDB()