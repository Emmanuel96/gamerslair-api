import { connect } from 'mongoose';
import logger from '../utils/logger';
const URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
async function connectDB() {
    try {
        logger.info("Connecting to mongoDB...");
        connect(URI);
        logger.info("Successfully connected to MongoDB!");
    }
    catch (error) {
        console.log("Failed to connect to MongoDB: ", error.message);
    }
}
connectDB();
