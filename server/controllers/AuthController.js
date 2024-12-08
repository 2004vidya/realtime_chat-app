import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync, unlinkSync} from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign(
        { email, userId },
        process.env.JWT_KEY, // Correct way to pass the secret key
        { expiresIn: maxAge }
    );
}

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists");
        }

        const user = await User.create({ email, password });
        const token = createToken(email, user.id);

        // Set cookie with JWT token
        res.cookie("jwt", token, {
            httpOnly: true, // Secure flag (set to true for production)
            maxAge,
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: "None", // Needed for cross-origin cookies
        });

        // Send response
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User with given email not found");
        }

        const auth = await compare(password, user.password);
        if (!auth) {
            return res.status(400).send("Password is incorrect");
        }

        // Create token
        const token = createToken(email, user.id);

        // Set cookie with JWT token
        res.cookie("jwt", token, {
            httpOnly: true, // Secure flag (set to true for production)
            maxAge,
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production
            sameSite: "None", // Needed for cross-origin cookies
        });

        // Send response
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const getUserInfo = async (req, res, next) => {
    try {
        console.log(req.userId);
        const userData = await User.findById(req.userId);
        if(!userData){
            return res.status(404).send("User with given id not found ");
        } 
        // Send response
        return res.status(200).json({
           
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
          
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        console.log(req.userId);
        const {userId} = req;
        const {firstName,lastName,color} = req.body;
        if(!firstName || !lastName){
            return res.status(400).send("firstname,lastname and color are required");
        }

        const userData = await User.findByIdAndUpdate(userId,{
            firstName,lastName,color,profileSetup:true
        },{new:true,runValidators:true})  
        // Send response
        return res.status(200).json({
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const addProfileImage = async (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).send("file is required");
        }

        const date = Date.now();
        let fileName= "uploads/profiles/" + date +req.file.originalname;
        renameSync(req.file.path,fileName);

        const updatedUser = await User.findByIdAndUpdate(req.userId,{image:fileName},{new:true,runValidators:true});

        // Send response
        return res.status(200).json({
                image:updatedUser.image
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};


export const removeProfileImage = async (req, res, next) => {
    try {
        console.log(req.userId);
        const {userId} = req;
        const user = await User.findById(userId)
        if(!user){
            res.status(404).send("user not found")
        }
        if(user.image){
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();
        // Send response
        return res.status(200).send("Profile image removed successfully ")

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};


