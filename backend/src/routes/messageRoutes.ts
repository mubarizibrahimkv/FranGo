import express from "express"
import { MessageRepo } from "../repository/messageRepository"
import { ConverstationRepo } from "../repository/converstaionRepository"
import { MessageService } from "../services/messageService"
import { MessageController } from "../controllers/messageController"
const router=express.Router()

const messageRepo=new MessageRepo()
const conversationRepo=new ConverstationRepo()
const messageService=new MessageService(conversationRepo,messageRepo)
const messageController=new MessageController(messageService)

router.route("/chats/messages").post(messageController.sendMessage).get(messageController.getMessages)
router.route("/chats/approved").get(messageController.getConversations)

export default router 