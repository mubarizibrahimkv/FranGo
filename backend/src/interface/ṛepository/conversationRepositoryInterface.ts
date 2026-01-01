import { Iconver, IConversation, IConversationWithUserW } from "../../models/conversationsModel";

export interface IConvestionRepo{
   create(data:Partial<Iconver>):Promise<IConversation>
   findByChannel(channel:string):Promise<IConversation|null>
   findByUserId(userId:string,search:string):Promise<IConversationWithUserW[]|null>
   updateLastMessage(channel: string,senderId:string, message: string): Promise<IConversation| null>
}