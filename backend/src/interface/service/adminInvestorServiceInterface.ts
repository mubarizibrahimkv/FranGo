import { IInvestor } from "../../models/investorModel";

export interface IAdminInvestorService{
    getPendingInvestors(page:number,search:string):Promise<{investor: IInvestor[],totalPages: number}>
    getApprovedInvestors(page:number,search:string): Promise<{investor: IInvestor[],totalPages: number}>;
    changeStatusInvestor(investorId:string,status:"approve"|"reject",reason?:string): Promise<void>;
    blockInvestor(investorId:string,block:boolean): Promise<void>;
    getInvestorDetails(investorId:string): Promise<IInvestor>;
}