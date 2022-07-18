import express from 'express';
import { authenticateToken } from '../middlewares/jwt';
const Router = express.Router();
Router.get('/api/test', authenticateToken, (req, res) => {
    const posts = [
        {
            email: "admin@admin.com",
            title: "Post 1"
        },
        {
            email: "user@user.com",
            title: "Post 2"
        }
    ];
    res.json(posts.filter((post) => post.email === req.user.email));
});
export default Router;
