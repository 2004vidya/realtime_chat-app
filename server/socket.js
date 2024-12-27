import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Map to track online users
    const userSocketMap = new Map();

    // Disconnect handler
    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`Removed user ${userId} from online list.`);
                break;
            }
        }
    };

    // Send message handler
    const sendMessage = async (message) => {
        try {
            const { sender, recipient } = message;
            const senderSocketId = userSocketMap.get(sender);
            const recipientSocketId = userSocketMap.get(recipient);

            // Save message to database
            const createdMessage = await Message.create(message);

            // Populate sender and recipient details
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipient", "id email firstName lastName image color");

            // Emit message to recipient
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receivedMessage", messageData);
            }

            // Emit message to sender
            if (senderSocketId) {
                io.to(senderSocketId).emit("receivedMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Socket connection event
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection.");
            socket.disconnect(); // Optionally disconnect the socket
        }

        // Register socket events
        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;

// import {Server as SocketIOServer} from "socket.io"
// import Message from "./models/MessagesModel.js";

// const setupSocket = (server)=>{
//     const io = new SocketIOServer(server,{
//         cors:{
//             origin:process.env.ORIGIN,
//             methods:["GET","POST"],
//             credentials:true
//         },
//     });
     
//     //we are going to set userids and socket instance from whcih we will know to which user to send message 


//     //whenever we call this function we will get all onpline users
//     const userSocketMap = new Map();

//     const disconnect = (socket)=>{
//         console.log(`client disconnected :${socket.io}`);
//         for (const[userId,socketId] of userSocketMap.entries()){
//             if(socketId === socket.id){
//                 userSocketMap.delete(userId);
//                 break;
//             }
//         }
        

//     }

//     const sendMessage = async (message)=>{
//         //getting the sender and user socketId from frontend 
//         const senderSocketId =userSocketMap.get(message.sender);
//         const recipientSocketId = userSocketMap.get(message.recipent);
//         //even if recipient is offline we are going to store the message in our database so that it doesnt get lost 

//         //creating message
//         const createdMessage = await Message.create(message);
//         // to send message details to user we need to popuLATE THE sender and recipient 

//         const messageData= await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color")
//         .populate("recipient","id email firstName lastName image color");
//         //if reciver is online
//         if(recipientSocketId){
//             io.to(recipientSocketId).emit("recievedMessage",messageData);

//         }
//         if(senderSocketId){
//             io.to(senderSocketId).emit("recievedMessage",messageData);
//         }
//     };

//     io.on("connection",(socket)=>{
//         //whenever we are connecting with socket we will be sending our userId from frontend 
//         const userId = socket.handshake.query.userId;
//         //if there is a userid 
//         if(userId){
//             userSocketMap.set(userId,socket.id);
//             console.log(`User Connected ${userId} with socket ID: ${socket.Id}`);
            
//         }else{
//             console.log("User ID not provided during connection");
//         }
//         socket.on("sendMessage",sendMessage)
//         socket.on("disconnect",()=>disconnect(socket))
//     })

// }

// export default setupSocket;