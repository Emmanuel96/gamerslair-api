const express = require('express')
const Router = express.Router()
const authenticateToken = require('../middlewares/jwt').authenticateToken

Router.get('/api/test', authenticateToken, (req, res, next) => {
  const posts = [
    {
      email: "admin@admin.com",
      title: "Post 1"
    },

    {
      email: "user@user.com",
      title: "Post 2"
    }
  ]

  res.json(posts.filter(post => post.email === req.user.email))
})

export default { Router }