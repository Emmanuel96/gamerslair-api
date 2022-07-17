const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  
  account_bal: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('User', UserSchema)