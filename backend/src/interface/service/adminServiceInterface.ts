import { IIndustryCategory } from "../../models/industryCategoryModel";
import { INotification } from "../../models/notificationModel";
import { IReport } from "../../models/reportModel";

export interface IAdminService{
    addIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    editIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    deleteIndustryCategory(id:string):Promise<IIndustryCategory>
    getIndustryCategory(search:string,page:number,filter?:string):Promise<{industries:IIndustryCategory[],totalPages:number}>
    getReports(page: number, search: string):Promise<{reports:IReport[],totalPages:number}>
    getNotification(userId:string):Promise<INotification[]>
    updateNotification(notificationId:string):Promise<INotification>
}