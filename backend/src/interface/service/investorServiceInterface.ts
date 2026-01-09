import { ApplicationResponseDTO } from "../../dtos/application/application.response.dto";
import { FranchiseResponseDTO } from "../../dtos/franchise/franchise.response.dto";
import { ReportResponseDTO } from "../../dtos/report/report.dto";
import { IApplication } from "../../models/applicationModel";
import { IFranchise } from "../../models/franchiseModel";
import { IInvestor } from "../../models/investorModel";
import { INotification } from "../../models/notificationModel";
import { IPayment, RazorpayOrder } from "../../models/paymentModel";
import { IFilters } from "../../types/addressInput";

export interface IInvestorService {
    getFranchises(filters: IFilters, page: number): Promise<{ franchises: FranchiseResponseDTO[], totalPages: number, totalFranchises: number }>
    getFranchiseDetails(franchiseId: string): Promise<FranchiseResponseDTO>
    getApplications(investorId: string, page: number,search:string,filter:string): Promise<{ application: ApplicationResponseDTO[], totalPages: number }>
    payAdvance(investorId: string, applicationId: string, data: Partial<IPayment>): Promise<{ order: RazorpayOrder, key: string }>
    createApplication(formData: IInvestor, investorId: string, franchiseId: string): Promise<void>
    verifyPayAdvance(investoId: string,applicationId:string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, amount: number): Promise<IPayment>
    applyReport(franchiseId: string, investorId: string,reason:string): Promise<ReportResponseDTO>
    getNotification( investorId: string): Promise<INotification[]>
    updateNotification( notificationId: string): Promise<INotification>
    getMyFranchises( investorId: string,search:string): Promise<(IApplication&{franchise:IFranchise})[]|null>
    deleteAplication( applicationId: string): Promise<IFranchise|null>
}