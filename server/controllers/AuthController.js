//this contains code for what should happen whenerver we signup 
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
        return res.cookie("jwt",createToken(email,userId),{
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
}