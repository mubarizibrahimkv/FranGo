import { AxiosError } from "axios";
import api from "./api";
import { MESSAGE_BASE_ROUTE } from "../constants/apiRoutes";

export const sendMessage = async (channel: string, message: string, senderId: string,senderRole:string,receiverId?:string,imageUrl?:string) => {
    try {
        
        const response = await api.post(`${MESSAGE_BASE_ROUTE}/chats/messages`, {
            channel, message, senderId,senderRole,receiverId,imageUrl
        })
        return response.data  
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("send message", error.response?.data);
        }
    }
}
export const fetchMessages = async (senderId: string,receiverId: string) => {
    try {
        const response = await api.get(`${MESSAGE_BASE_ROUTE}/chats/messages`,{params:{senderId,receiverId}})
        return response.data  
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Fetch messages error :", error.response?.data);
        }
    }
}
export const getConversation = async (userId: string) => {
    try {
        
        const response = await api.get(`${MESSAGE_BASE_ROUTE}/chats/approved`,{params:{userId}})
        return response.data  
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Fetch conversation error :", error.response?.data);
        }
    }
}