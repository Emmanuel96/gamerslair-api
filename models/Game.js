const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
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

  progress:{
    type:String,
    enum:["created","reported","verified"],
    default:"created",
    required: true,
  },
  
  winner:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  
  reported_by:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  }
})

module.exports = mongoose.model('Game', GameSchema)