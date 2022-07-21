import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from '../utils/config'

import User from '../models/User';
import tokens from '../middlewares/jwt';

interface userObj {
    username: string,
    email?: string,
    password: string,
    id?: string,
    _id: string,
    account_bal: number
}

const post_signin = (req: Request | any, res: Response, next: any): void => {
    const email: string = req.body.email.toLowerCase()
    const password: string = req.body.password
  
    User.findOne({email: email}).then((db_user: userObj): Response | void => {
      if(!db_user){
        return res.status(404).json({
          sucess: false,
          message: "You have entered an invalid username or password"
        })
      }
      const user_id: string =  db_user._id

      bcrypt.compare(password, db_user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {

          const user: any = {
            id: user_id,
            email: req.body.email.toLowerCase(),
            password: req.body.password,
            username: ''
          }
  
          const accessToken: string = tokens.generateAccessToken(user)
  
          const refreshToken: string = jwt.sign(user, config.REFRESH_TOKEN_SECRET)
          
          delete user.password
          user.username = db_user.username
          user.account_bal = db_user.account_bal
          res.json({ accessToken, refreshToken, user })
        }else{
          res.status(404).json({
            sucess: false,
            message: "You have entered an invalid username or password"
          })
        }
      })
    }).catch((error: Error): void => next(error))
  }

const post_signup = (req: Request, res: Response, next: any): void => {
    const username: Request = req.body.username.toLowerCase();
    const email: Request = req.body.email.toLowerCase();
    const password: Request = req.body.password;
    const newUser: any = new User({
        username,
        email,
        password
    });

    User.findOne({ email: email }).then((user: userObj): any => {
        if (user) {
            return res.status(400).json({
                success: false,
                message: "This email address is already being used"
            });
        }
        bcrypt.genSalt(10, (_err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    throw err;
                newUser.password = hash;
                newUser.save().then((savedUser: userObj) => {
                    res.status(200).json(savedUser);
                });
            });
        })
    }).catch((error: Error): void => next(error));
};

export { post_signin, post_signup }