import { INotificationRepo } from "../interface/ṛepository/notificationRepoInterface";
import Notification, { INotification } from "../models/notificationModel";
import { BaseRepository } from "./baseRepository";

export class NotificationRepo extends BaseRepository<INotification> implements INotificationRepo{
    constructor(){
        super(Notification);
    }
    async findByUserId(userId:string){
       return await Notification.find({userId,isRead:false}).sort({createdAt:-1});
    }
    async updateIsRead(notificationId:string){
       return await Notification.findByIdAndUpdate(notificationId,{isRead:true},{ new: true });
    }
}