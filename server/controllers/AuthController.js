//this contains code for what should happen whenerver we signup 
import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge= 3*24*60*60*1000;

const createToken = (email,userId)=>{// we are teling that tokens data is email and userID and encryption key is jwt key and the token expires in 3 days  
    return jwt.sign({email,userId}.process.env.JWT_KEY,{expiresIn:maxAge})
}

export const signup = async (req,res,next)=>{
    try
    {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).send("Email and Password are required")
        }
        const user = await User.create({email,password});
        return res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"

        });
        return res.status(201).json({ //201 indicates that user has been created 
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup

            }
        })

        
    }catch(errror)
    {
        console.log(error);
        return res.status(500).send("Internal server error")
        
    }
};

export const login = async (req,res,next)=>{
    try
    {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).send("Email and Password are required")
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send("User with given email not found ")
            

        }
        const auth = await compare(password,user.password);// we are comparing pw received from client side and the encrypted pw from database
        if(!auth){
            return res.status(400).send("Password is incorrect")
        }
        // if everything works we are going to send a jwt cookie 
        return res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"

        });
        return res.status(200).json({ 
            user:{
                id:user.id,
                email:user.email,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                color:user.color

            }
        })

        
    }catch(errror)
    {
        console.log(error);
        return res.status(500).send("Internal server error")
        
    }
};