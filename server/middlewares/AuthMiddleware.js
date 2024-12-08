import jwt from "jsonwebtoken"

export const  verifyToken =(req,res,next)=>{
    console.log(req.cookies);
    const token = req.cookies.jwt;
    console.log(token);
    if(!token){
        console.warn("No JWT token found in cookies");
        return res.status(401).send("You are not authenticated")
    }
    jwt.verify(token,process.env.JWT_KEY,(err,payload)=>{
        if(err){
            console.error("JWT verification failed:", err.message);
            return res.status(403).send("Token is not valid ")
        }
        req.userId = payload.userId;
        console.log("JWT verified successfully. User ID:", payload.userId);
        next();
    });
    
};