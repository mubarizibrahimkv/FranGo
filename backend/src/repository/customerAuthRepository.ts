import { ICustomerAuthRepo } from "../interface/ṛepository/customerAuthRepoInterface";
import Customer, { ICustomer } from "../models/customerModel";
import { BaseRepository } from "./baseRepository";

export class CustomerAuthRepo extends BaseRepository<ICustomer> implements ICustomerAuthRepo {

    constructor() {
        super(Customer);
    } 
    async findByEmail(email: string): Promise<ICustomer | null> {
        return await Customer.findOne({ email });
    }
    async findById(id: string): Promise<ICustomer | null> {
        return await Customer.findById(id);
    }
    async registerCustomer(userName: string, email: string, password: string, role: string, otp: string, otpExpires: number) {
        const customer = new Customer({
            userName,
            email,
            password,
            role,
            otp,
            otpExpires,
        });
        return await customer.save();
    }
    async saveUser(user: ICustomer) {
        return await user.save();
    }

}