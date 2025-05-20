import express from 'express';
import { userRigester, userLogin, profile } from '../controllers/user.controller.js';
import { authMiddleware }from '../middlewares/auth.js';

const router = express.Router();

router.post("/rigester",userRigester);
router.post("/login",userLogin);
router.get('/profile',authMiddleware,profile);

router.get('/', (req, res) => {
    res.send('User Route');
});

export default router;
