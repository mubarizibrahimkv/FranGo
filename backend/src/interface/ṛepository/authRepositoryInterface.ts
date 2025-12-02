import { IInvestor } from "../../models/investorModel";

export interface IAuthRepo {
    registerUser(userName: string,email: string,hashedPassword: string,role: string,hashedOtp: string,otpExpires: number): Promise<IInvestor> | null
    findByEmail(email: string): Promise<IInvestor|null> 
    findById(email: string): Promise<IInvestor| null> ;
    saveUser(user: Partial<IInvestor>): Promise<IInvestor | null>
}