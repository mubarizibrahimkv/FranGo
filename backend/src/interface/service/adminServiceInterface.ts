import { CompanyIndustryCategoryDTO } from "../../dtos/company/company.indutryCategory.dto";
import { ReportResponseDTO } from "../../dtos/report/report.dto";
import { IIndustryCategory } from "../../models/industryCategoryModel";
import { INotification } from "../../models/notificationModel";

export interface IAdminService{
    addIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    editIndustryCategory(data:IIndustryCategory):Promise<IIndustryCategory>
    deleteIndustryCategory(id:string):Promise<IIndustryCategory>
    getIndustryCategory(search:string,page:number,filter?:string):Promise<{industries:CompanyIndustryCategoryDTO[],totalPages:number}>
    getReports(page: number, search: string):Promise<{reports:ReportResponseDTO[],totalPages:number}>
    getNotification(userId:string):Promise<INotification[]>
    updateNotification(notificationId:string):Promise<INotification>
}