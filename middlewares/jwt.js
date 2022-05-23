const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if(token == null) return res.status(401)
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if(error) return res.status(403)

    req.user = user

    next()
  })
}

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

module.exports = { 
  authenticateToken,
  generateAccessToken
}