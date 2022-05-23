const User = require('../models/User')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const generateAccessToken = require('../middlewares/jwt').generateAccessToken

exports.post_signin = (req, res, next) => {
  email = req.body.email.toLowerCase()
  password = req.body.password

  User.findOne({email: email}).then(user => {
    if(!user){
      return res.status(404).json({
        sucess: false,
        message: "You have entered an invalid username or password"
      })
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err
      if (isMatch) {
        const user = {
          email: req.body.email.toLowerCase(),
          password: req.body.password
        }

        const accessToken = generateAccessToken(user)

        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        res.json({
          accessToken, refreshToken
        })
      }else{
        res.status(404).json({
          sucess: false,
          message: "You have entered an invalid username or password"
        })
      }
    })
  }).catch(error => next(error))
}

exports.post_signup = (req, res, next) => {
  let username = req.body.username.toLowerCase()
  let email = req.body.email.toLowerCase()
  let password = req.body.password

  const newUser = new User({
    username,
    email,
    password
  })

  User.findOne({ email: email }).then(user => {
    if(user){
      return res.status(400).json({
        success: false,
        message: "This email address is already being used"
      })
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser.save().then(savedUser => {
          res.status(200).json(savedUser)
        })
      })
    })
  })
}