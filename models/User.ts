import mongoose from 'mongoose'

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

export default mongoose.model('User', UserSchema)