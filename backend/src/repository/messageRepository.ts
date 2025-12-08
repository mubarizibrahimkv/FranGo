import { IMessageRepo } from "../interface/ṛepository/messageRepoInterface";
import ChatMessage, { IChatMessage } from "../models/chat";
import { BaseRepository } from "./baseRepository";

export class MessageRepo extends BaseRepository<IChatMessage> implements IMessageRepo{
   constructor(){
    super(ChatMessage);
   }
   async findByChannel(channel:string){
      return ChatMessage.find({channel}).sort({createdAt:-1});
   }
   async markMessagesRead(channelId:string,senderId:string){
      return await ChatMessage.updateMany({channel:channelId,senderId,read:false},{$set:{read:true}});
   }
   async unreadCount(channel:string,senderId:string){
      return await ChatMessage.countDocuments({channel,senderId,read:false});
   }
}