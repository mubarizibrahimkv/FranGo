import { UpdateWriteOpResult } from "mongoose";
import { IChatMessage } from "../../models/chat";

export interface IMessageRepo{
   create(data:Partial<IChatMessage>):Promise<IChatMessage>
  findByChannel(channel:string):Promise<IChatMessage[]>
  markMessagesRead(channelId:string,senderId:string):Promise<UpdateWriteOpResult>
  unreadCount(channel:string,senderId:string):Promise<number>
}