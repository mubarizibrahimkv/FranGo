import { IChatMessage } from "../../models/chat";
import { IConversation, IconversationWithUser } from "../../models/conversationsModel";

export interface IMessageService{
    generateChannel(u1:string,u2:string):string
    sendMessage(channel:string,message:string,senderId:string,senderRole:"company"|"investor",receiverId:string,imageUrl?:string):Promise<IChatMessage>
    getConversations(userId:string):Promise<IconversationWithUser[]|null>
    getMessages (senderId:string,receiverId:string):Promise<IChatMessage[]>
}