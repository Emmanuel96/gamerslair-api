const mongoose = require('mongoose')
const URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

console.log("Connecting to mongoDB...")

mongoose
  .connect(URI)
  .then(() => {
    console.log("Successfully connected to MongoDB!")
  }).catch(err => {
  console.log("Failed to connect to MongoDB: ", err.message)
})