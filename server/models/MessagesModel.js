import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:false,//for channels there will be multiple recipients 
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType==='text';
        },
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType==='file';
        },

    },
    timestamp:{
        type:Date,
        default:Date.now,

    }


});

const Message = mongoose.model("Messages",MessageSchema);
export default Message;