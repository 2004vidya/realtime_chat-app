
import {Server as SocketIOServer} from "socket.io"

const setupSocket = (server)=>{
    const io = new SocketIOServer(server,{
        cors:{
            origin:process.env.ORIGIN,
            methods:["GET","POST"],
            credentials:true
        },
    });
     
    //we are going to set userids and socket instance from whcih we will know to which user to send message 


    //whenever we call this function we will get all onpline users
    const userSocketMap = new Map();

    const disconnect = (socket)=>{
        console.log(`client disconnected :${socket.io}`);
        for (const[userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
        

    }

    io.on("connection",(socket)=>{
        //whenever we are connecting with socket we will be sending our userId from frontend 
        const userId = socket.handshake.query.userId;
        //if there is a userid 
        if(userId){
            userSocketMap.set(userId,socket.id);
            console.log(`User Connected ${userId} with socket ID: ${socket.Id}`);
            
        }else{
            console.log("User ID not provided during connection");
        }

        socket.on("disconnect",()=>disconnect(socket))
    })

}

export default setupSocket;