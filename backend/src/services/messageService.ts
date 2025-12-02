import { IConvestionRepo } from "../interface/ṛepository/conversationRepositoryInterface";
import { IMessageRepo } from "../interface/ṛepository/messageRepoInterface";
import { IMessageService } from "../interface/ṛepository/messageServiceInterface";
import { IChatMessage } from "../models/chat";
import Company from "../models/companyModel";
import { Iconver } from "../models/conversationsModel";
import Investor from "../models/investorModel";
import { io } from "../config/socket"

export class MessageService implements IMessageService {
    constructor(private _conversationRepo: IConvestionRepo, private _messageRepo: IMessageRepo) { }
    generateChannel = (u1: string, u2: string) => {
        return [u1, u2].sort().join("_");
    }
    sendMessage = async (channel: string, message: string, senderId: string, senderRole: "company" | "investor", receiverId: string, imageUrl?: string) => {
        try {
            let finalChannel = channel;

            if (!channel) {
                finalChannel = this.generateChannel(senderId, receiverId);

                const existConversation = await this._conversationRepo.findByChannel(finalChannel);

                if (!existConversation) {
                    const receiverRole = senderRole === "investor" ? "company" : "investor"
                    const conversationData: Iconver = {
                        channel: finalChannel,
                        participants: [
                            { userId: senderId, role: senderRole },
                            { userId: receiverId, role: receiverRole }
                        ],
                        lastMessage: message,
                        lastSender: senderId,
                        timestamps: new Date()
                    };
                    await this._conversationRepo.create(conversationData);
                }
            }

            const messageData: Partial<IChatMessage> = {
                channel: finalChannel,
                senderId,
                message,
                read: false,
                timestamp: new Date()
            };
            await this._conversationRepo.updateLastMessage(finalChannel, senderId, message)

            const createdMessage = await this._messageRepo.create(messageData);
            const unreadCount = await this._messageRepo.unreadCount(finalChannel, senderId)

            console.log("undread count is ", unreadCount)
            console.log("last message ", message)
            console.log("recievef id that is company id in send message",receiverId)
            if (io) {
                io.to(receiverId).emit("unread_count_update", {
                    channel: finalChannel,
                    unreadCount
                })
            }

            return createdMessage;
        } catch (error) {
            console.log("Error sending message", error);
            throw error;
        }
    };
    getConversations = async (userId: string) => {
        try {
            const conversations = await this._conversationRepo.findByUserId(userId);
            const result = []

            if (conversations) {

                for (let convo of conversations) {
                    const other = convo.participants.find(p => p.userId !== userId);

                    if (!other) throw new Error("Other participant not found");

                    let unreadCount=await this._messageRepo.unreadCount(convo.channel,other.userId)
                    let userName = "";
                    let profileImage = "";
                    let user = await Investor.findById(other.userId);

                    if (user) {
                        userName = user.userName;
                        profileImage = user.profileImage;
                    } else {
                        const company = await Company.findById(other.userId);
                        if (company) {
                            userName = company.companyName || "";
                            profileImage = company.companyLogo || "";
                        }
                    }

                    result.push({
                        ...convo.toObject(),
                        userName,
                        profileImage,
                        unreadCount
                    });
                }
            }
            return result
        } catch (error) {
            console.log("Error getting conversations", error);
            throw error;
        }
    };
    getMessages = async (senderId: string, receiverId: string) => {
        try {
            const channel = await this.generateChannel(senderId, receiverId)
            const messages = await this._messageRepo.findByChannel(channel)
            await this._messageRepo.markMessagesRead(channel, receiverId)
            const unreadCount = await this._messageRepo.unreadCount(channel, receiverId);
 
            console.log("sender id that is company id in get message",senderId)
            console.log("unread count after opening chat:", unreadCount);

            if (io) {
                io.to(senderId).emit("unread_count_update", {
                    channel,
                    unreadCount
                });
            }
            return messages
        } catch (error) {
            console.log("Error fetching message", error);
            throw error;
        }
    }
    unreadCount = async (channel: string, senderId: string) => {
        return this._messageRepo.unreadCount(channel, senderId)
    }
}