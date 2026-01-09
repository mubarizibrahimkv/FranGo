import { ApplicationListDTO, ApplicationResponseDTO } from "../../dtos/application/application.response.dto";
import { CompanyIndustryCategoryDTO } from "../../dtos/company/company.indutryCategory.dto";
import { CompanyProfileDTO } from "../../dtos/company/company.profile.dto";
import {  FranchiseResponseDTO } from "../../dtos/franchise/franchise.response.dto";
import { IApplication } from "../../models/applicationModel";
import { ICompany } from "../../models/companyModel";
import { IFranchise } from "../../models/franchiseModel";
import { INotification } from "../../models/notificationModel";

export default interface IcompanyService{ 
    getProfiles(companyId:string):Promise<CompanyProfileDTO>
    getFranchises(companyId:string,page:number,search:string,filter?: Record<string, string>):Promise<Partial<{companyIndustryCategory:CompanyIndustryCategoryDTO,franchises:FranchiseResponseDTO[],totalPages:number}>>
    addFranchise(companyId:string,data:IFranchise):Promise<Partial<IFranchise>>
    editFranchise(franchiseId:string,data:Partial<IFranchise>):Promise<Partial<IFranchise>>
    deleteFranchise(franchiseId:string):Promise<Partial<IFranchise>>
    franchiseDetails(franchiseId:string):Promise<FranchiseResponseDTO>
    updateLogo(companyLogo:string,companyId:string):Promise<void>
    reapply(companyId:string):Promise<void>
    getApplications(companyId:string,page:number,search:string,filter?:Record<string,string>):Promise<{application:ApplicationResponseDTO[],totalPages:number}>
    changeApplicationStatus(companyId:string,status:"rejected"|"approved"|"pending"):Promise<ApplicationResponseDTO>
    changePassword(userId:string,oldPassword:string,newPassword:string):Promise<boolean>
    updateProfile(data:Partial<ICompany>,companyId:string): Promise<CompanyProfileDTO | null>
    getNotification(userId:string): Promise<INotification[]>
    updateNotification(notificationId:string): Promise<INotification>
    verifyPayment(companyId:string,razorpayOrderId: string,razorpayPaymentId: string,razorpaySignature: string,amount:string): Promise<{message:string}>
};