const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log("Connecting to mongoDB...")

mongoose
  .connect(url)
  .then(() => {
    console.log("Successfully connected to MongoDB!")
  }).catch(err => {
  console.log("Failed to connect to MongoDB: ", err.message)
})