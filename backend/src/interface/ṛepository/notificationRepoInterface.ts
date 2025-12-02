import { INotification } from "../../models/notificationModel";

export interface INotificationRepo{
    create(data:Partial<INotification>):Promise<INotification>
    findByUserId(userId:string):Promise<INotification[]|null>
    updateIsRead(userId:string):Promise<INotification|null>
}