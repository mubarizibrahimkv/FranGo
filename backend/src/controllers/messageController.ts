import { Request, Response } from "express";
import { IMessageService } from "../interface/ṛepository/messageServiceInterface";
import HttpStatus from "../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class MessageController {
    constructor(private _messageService: IMessageService) { }
     private handleError(res: Response, error: unknown) {

    const err =
      typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "message" in error
        ? (error as { status: number; message: string })
        : error instanceof Error
          ? { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
          : { status: HttpStatus.INTERNAL_SERVER_ERROR, message: ERROR_MESSAGES.SERVER_ERROR };
          return res.status(err.status).json({
    success: false,
    message: err.message,
  });

  }
    
    sendMessage = async (req: Request, res: Response) => {
        const { channel, message, senderId, senderRole, receiverId, imageUrl } = req.body;
        try {
            await this._messageService.sendMessage(channel, message, senderId, senderRole, receiverId, imageUrl);
            res.status(HttpStatus.OK).json({ success: true, });
        } catch (error: unknown) {
            this.handleError(res, error); 
        }   
    };

    getConversations = async (req: Request, res: Response) => { 
        const userId = req.query.userId as string;
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        try {
            const conversations = await this._messageService.getConversations(userId,searchStr);
            console.log(conversations);
            res.status(HttpStatus.OK).json({ success: true, conversations });
        } catch (error: unknown) {
           this.handleError(res, error); 
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
            this.handleError(res, error); 
        }
    };

}