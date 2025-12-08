import { Request, Response } from "express";
import { IMessageService } from "../interface/ṛepository/messageServiceInterface";
import HttpStatus from "../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class MessageController {
    constructor(private _messageService: IMessageService) { }
    
    sendMessage = async (req: Request, res: Response) => {
        const { channel, message, senderId, senderRole, receiverId, imageUrl } = req.body;
        try {
            await this._messageService.sendMessage(channel, message, senderId, senderRole, receiverId, imageUrl);
            res.status(HttpStatus.OK).json({ success: true, });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }   
    };

    getConversations = async (req: Request, res: Response) => {
        const userId = req.query.userId as string;
        try {
            const conversations = await this._messageService.getConversations(userId);
            res.status(HttpStatus.OK).json({ success: true, conversations });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

    getMessages = async (req: Request, res: Response) => {
        const senderId = req.query.senderId as string;
        const receiverId = req.query.receiverId as string;
        if (!senderId || !receiverId) {
             res.status(HttpStatus.BAD_REQUEST).json({ message: "senderId and receiverId required" });
        }
        try {
            const messages = await this._messageService.getMessages(senderId, receiverId);
            res.status(HttpStatus.OK).json({ success: true, messages });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

}