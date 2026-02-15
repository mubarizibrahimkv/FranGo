import { IConvestionRepo } from "../interface/ṛepository/conversationRepositoryInterface";
import Conversation, { IConversation } from "../models/conversationsModel";
import { BaseRepository } from "./baseRepository";

export class ConverstationRepo extends BaseRepository<IConversation> implements IConvestionRepo {
   constructor() {
      super(Conversation);
   }
   async findByChannel(channel: string) {
      return await Conversation.findOne({ channel });
   }
   async countByCompany(companyId: string) {
      return await Conversation.countDocuments({ "participants.userId": companyId,"participants.role": "company" });
   }

   async findByUserId(userId: string) { return await Conversation.find({ "participants.userId": userId, }).sort({ timeStamp: -1 }); }

   async updateLastMessage(channel: string, senderId: string, message: string) {
      return await Conversation.findOneAndUpdate(
         { channel },
         { 
            lastMessage: message,
            lastSender: senderId,
            updatedAt: new Date(),
         },
         { new: true }
      );
   }
}