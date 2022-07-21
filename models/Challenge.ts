import mongoose from 'mongoose'

const ChallengeSchema = new mongoose.Schema({
  sender:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },

  reciever:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  },

  console: {
    type: String,
    required: true
  },

  game: {
    type: String,
    required: true
  },

  bet_amount: {
    type: Number,
    required: true
  },

  rules: {
    type: String,
    required: true
  },

  state:{
    type:String,
    enum:["created", "accepted", "rejected"],
    default:"created",
    required: true,
  },
})

export default mongoose.model('Challenge', ChallengeSchema)