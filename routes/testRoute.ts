import express from 'express';
import { Request, Response } from 'express';
import tokens from '../middlewares/jwt';

const Router = express.Router()

Router.get('/api/test', tokens.authenticateToken, (req: Request | any, res: Response): Response => {
  const posts: object[] = [
    {
      email: "admin@admin.com",
      title: "Post 1"
    },

    {
      email: "user@user.com",
      title: "Post 2"
    }
  ]

  return res.json(
    posts.filter((post: any) => post.email === req.user.email)
  )
})

export default Router