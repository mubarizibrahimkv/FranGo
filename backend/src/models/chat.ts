
import mongoose, { Document,Schema, Types } from "mongoose";

export interface IChatMessage extends Document {
    _id:Types.ObjectId
    channel: string;
    senderId: string;
    message: string;
    read:boolean
    timestamp: Date;
  } 

const ChatMessageSchema= new Schema<IChatMessage>({
    channel:{
        type:String,
        required:true,
        index:true
    },
    senderId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    read: { type: Boolean, default: false },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const ChatMessage= mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
export default ChatMessage;