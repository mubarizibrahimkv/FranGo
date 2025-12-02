import { ICustomer } from "../../models/customerModel";

export interface ICustomerAuthRepo {
    findByEmail(email:string):Promise<ICustomer | null>
    findById(id:string):Promise<ICustomer | null>
    registerCustomer(userName: string, email: string, password: string, role: string, otp: string, otpExpires: number): Promise<ICustomer | null>
    saveUser(user:ICustomer):Promise<ICustomer | null>
}