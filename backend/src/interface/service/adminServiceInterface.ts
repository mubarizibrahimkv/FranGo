import { IIndustryCategory } from "../../models/industryCategoryModel";
import { INotification } from "../../models/notificationModel";
import { IReport } from "../../models/reportModel";

export interface IAdminService{
    addIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    editIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    deleteIndustryCategory(id:string):Promise<IIndustryCategory>
    getIndustryCategory():Promise<IIndustryCategory[]>
    getReports():Promise<IReport[]>
    getNotification(userId:string):Promise<INotification[]>
    updateNotification(notificationId:string):Promise<INotification>
}