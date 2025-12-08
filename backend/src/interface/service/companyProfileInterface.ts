import { IApplication } from "../../models/applicationModel";
import { ICompany } from "../../models/companyModel";
import { IFranchise } from "../../models/franchiseModel";
import { IIndustryCategory } from "../../models/industryCategoryModel";
import { INotification } from "../../models/notificationModel";
import { CompanySerivceResponse } from "../../types/interfaceTypes";

export default interface IcompanyService{
    getProfiles(companyId:string):Promise<CompanySerivceResponse>
    getFranchises(companyId:string,page:number):Promise<Partial<{companyIndustryCategory:IIndustryCategory,franchises:IFranchise[],totalPages:number}>>
    addFranchise(companyId:string,data:IFranchise):Promise<Partial<IFranchise>>
    editFranchise(franchiseId:string,data:Partial<IFranchise>):Promise<Partial<IFranchise>>
    deleteFranchise(franchiseId:string):Promise<Partial<IFranchise>>
    franchiseDetails(franchiseId:string):Promise<IFranchise>
    updateLogo(companyLogo:string,companyId:string):Promise<void>
    reapply(companyId:string):Promise<void>
    getApplications(companyId:string,page:number):Promise<{application:IApplication[],totalPages:number}>
    changeApplicationStatus(companyId:string,status:"rejected"|"approved"|"pending"):Promise<IApplication>
    changePassword(userId:string,oldPassword:string,newPassword:string):Promise<boolean>
    updateProfile(data:Partial<ICompany>,companyId:string): Promise<ICompany | null>
    getNotification(userId:string): Promise<INotification[]>
    updateNotification(notificationId:string): Promise<INotification>
    verifyPayment(companyId:string,razorpayOrderId: string,razorpayPaymentId: string,razorpaySignature: string,amount:string): Promise<{message:string}>
};;;;;;;;;;