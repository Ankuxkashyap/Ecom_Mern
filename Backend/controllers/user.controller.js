import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRigester = async (req, res) => {
    try{
        const {name, email,password,isAdmin} = req.body;
        const user = await User.find({email});

        if(!name || !email || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }

        if(user.length > 0){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            isAdmin,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).json({message: "User registered successfully"});

    }   catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}

export const userLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!email || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({token, user: {id: user._id, name: user.name, email: user.email}});
    }
    catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}

export const profile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!req.user){
            return res.status(400).json({message: "User not found"});
        }

        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        return res.status(200).json({user: {id: user._id, name: user.name, email: user.email}});
    }
    catch(err){
        return res.status(500).json({message: "Internal server error"});
    }
}