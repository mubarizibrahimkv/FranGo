import { IConvestionRepo } from "../interface/ṛepository/conversationRepositoryInterface";
import { IMessageRepo } from "../interface/ṛepository/messageRepoInterface";
import { IMessageService } from "../interface/ṛepository/messageServiceInterface";
import { IChatMessage } from "../models/chat";
import Company from "../models/companyModel";
import { Iconver } from "../models/conversationsModel";
import Investor from "../models/investorModel";
import { io } from "../config/socket";
import dotenv from "dotenv";
dotenv.config();

export class MessageService implements IMessageService {
    constructor(private _conversationRepo: IConvestionRepo, private _messageRepo: IMessageRepo) { }
    generateChannel = (u1: string, u2: string) => {
        return [u1, u2].sort().join("_");
    };
    sendMessage = async (
        channel: string,
        message: string,
        senderId: string,
        senderRole: "company" | "investor",
        receiverId: string,
        imageUrl?: string
    ) => {
        try {
            let finalChannel = channel;

            if (!channel) {
                finalChannel = this.generateChannel(senderId, receiverId);

                const existConversation =
                    await this._conversationRepo.findByChannel(finalChannel);

                if (!existConversation) {

                    // if (senderRole === "company") {
                       
                    //     if (!company?.subscription?.isActive) {
                    //         const totalChats = await this._conversationRepo.countByCompany(senderId);
                    //         const FREE_CHAT_LIMIT = Number(process.env.FREE_CHAT_LIMIT || 0);

                    //         if (totalChats >= FREE_CHAT_LIMIT) {
                    //             throw {
                    //                 status: HttpStatus.FORBIDDEN,
                    //                 message: "Free chat limit exceeded. Please subscribe."
                    //             };
                    //         }
                    //     }
                    // }

                    const receiverRole =senderRole === "investor" ? "company" : "investor";

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

            await this._conversationRepo.updateLastMessage(
                finalChannel,
                senderId,
                message
            );

            const createdMessage = await this._messageRepo.create(messageData);

            const unreadCount =await this._messageRepo.unreadCount(finalChannel, senderId);

            if (io) {
                io.to(receiverId).emit("unread_count_update", {
                    channel: finalChannel,
                    unreadCount
                });
            }

            return createdMessage;
        } catch (error) {
            console.log("Error sending message", error);
            throw error;
        }
    };

    getConversations = async (userId: string, search: string) => {
        try {
            const conversations = await this._conversationRepo.findByUserId(userId, search);
            const result = [];

            if (conversations) {

                for (const convo of conversations) {
                    const other = convo.participants.find(p => p.userId !== userId);

                    if (!other) throw new Error("Other participant not found");

                    const unreadCount = await this._messageRepo.unreadCount(convo.channel, other.userId);
                    let userName = "";
                    let profileImage = "";
                    const user = await Investor.findById(other.userId);

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
            return result;
        } catch (error) {
            console.log("Error getting conversations", error);
            throw error;
        }
    };
    getMessages = async (senderId: string, receiverId: string) => {
        try {
            const channel = await this.generateChannel(senderId, receiverId);
            const messages = await this._messageRepo.findByChannel(channel);
            await this._messageRepo.markMessagesRead(channel, receiverId);
            const unreadCount = await this._messageRepo.unreadCount(channel, receiverId);

            if (io) {
                io.to(senderId).emit("unread_count_update", {
                    channel,
                    unreadCount
                });
            }
            return messages;
        } catch (error) {
            console.log("Error fetching message", error);
            throw error;
        }
    };
    unreadCount = async (channel: string, senderId: string) => {
        return this._messageRepo.unreadCount(channel, senderId);
    };
}