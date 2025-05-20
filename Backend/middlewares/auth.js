import jwt from 'jsonwebtoken';
import  User  from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        req.user = user;

        next();
    }
    catch(err){
        res.status(401).json({message:"Unauthorized"});
    }
};