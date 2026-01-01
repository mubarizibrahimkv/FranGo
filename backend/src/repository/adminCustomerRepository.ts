import { IAdminCustomerRepo } from "../interface/ṛepository/adminCustomerRepoInterface";
import Customer from "../models/customerModel";

export class AdminCustomerRepo implements IAdminCustomerRepo  {
    async getCustomers(limit:number,skip:number,search:string) {
        return Customer.find({$or:[{email:{$regex:search,$options:"i"}},{userName:{$regex:search,$options:"i"}}]}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    }
    async blockCustomer(customerId: string, block: boolean) {
        return Customer.findByIdAndUpdate((customerId), { isBlocked:block }, { new: true }); 
    }
}