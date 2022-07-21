import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../utils/config'

interface userObj {
    email: string,
    password: string
}

const authenticateToken = (req: Request | any, res: Response, next?: any): any => {
    const authHeader: string = req.headers['authorization'] as string;
    const token: string = authHeader && authHeader.split(' ')[1];

    if (token === null) return res.status(401);
    
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (error, user): Response | void => {
        if (error)
            return res.status(403);
        req.user = user;
        next();
    });
};
const generateAccessToken = (user: userObj) => {
    return jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: '86400s' });
};

const tokens = { authenticateToken, generateAccessToken };

export default tokens