import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import ContactsRoutes from "./routes/ContactsRoutes.js"
import setupSocket from "./socket.js"



dotenv.config(); // with this command all the env variables will be within process.env

// if (typeof window === "undefined") {
//     import express from "express";
// }// Only import Express on the server-side
const app =express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGO_URI;

app.use(cors({ //cors is a middleware which is used when different servers need to communicate with each other eg client and server both are running on diff server and we need to connect them  
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true //to enable cookies
}));

//we are telling express that whenever a user comes to this route and calls an image then we need to serve the asset from our directory to request
app.use("/uploads/profiles",express.static("uploads/profiles"));

app.use(cookieParser());//middleware for gettig cookies from frontend
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/contacts",ContactsRoutes)

const server = app.listen(port,()=>{
    console.log("server is running ");
    
})

setupSocket(server);

mongoose.connect(uri).then(()=>{
    console.log("DB connection successfull");
    
}).catch(err=>console.log(err.message)
)