import { IApplication } from "../../models/applicationModel";
import { IFranchise } from "../../models/franchiseModel";
import { IInvestor } from "../../models/investorModel";
import { INotification } from "../../models/notificationModel";
import { IPayment, RazorpayOrder } from "../../models/paymentModel";
import { IReport } from "../../models/reportModel";
import { IFilters } from "../../types/addressInput";

export interface IInvestorService {
    getFranchises(filters: IFilters, page: number): Promise<{ franchises: IFranchise[], totalPages: number, totalFranchises: number }>
    getFranchiseDetails(franchiseId: string): Promise<IFranchise>
    getApplications(investorId: string, page: number): Promise<{ application: IApplication[], totalPages: number }>
    payAdvance(investorId: string, applicationId: string, data: Partial<IPayment>): Promise<{ order: RazorpayOrder, key: string }>
    createApplication(formData: IInvestor, investorId: string, franchiseId: string): Promise<IFranchise>
    verifyPayAdvance(investoId: string,applicationId:string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string, amount: number): Promise<IPayment>
    applyReport(franchiseId: string, investorId: string,reason:string): Promise<IReport>
    getNotification( investorId: string): Promise<INotification[]>
    updateNotification( notificationId: string): Promise<INotification>
}