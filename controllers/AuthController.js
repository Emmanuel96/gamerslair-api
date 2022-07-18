import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateAccessToken } from '../middlewares/jwt';
const post_signin = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "You have entered an invalid username or password"
            });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err)
                throw err;
            if (isMatch) {
                const user = {
                    email: req.body.email.toLowerCase(),
                    password: req.body.password
                };
                const accessToken = generateAccessToken(user);
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
                res.json({
                    accessToken, refreshToken
                });
            }
            else {
                res.status(404).json({
                    sucess: false,
                    message: "You have entered an invalid username or password"
                });
            }
        });
    }).catch(error => next(error));
};
const post_signup = (req, res) => {
    const username = req.body.username.toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const newUser = new User({
        username,
        email,
        password
    });
    User.findOne({ email: email }).then((user) => {
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
                newUser.save().then((savedUser) => {
                    res.status(200).json(savedUser);
                });
            });
        });
    });
};
export { post_signin, post_signup };
