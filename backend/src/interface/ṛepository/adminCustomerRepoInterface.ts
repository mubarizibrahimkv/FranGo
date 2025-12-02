import { ICustomer } from "../../models/customerModel";

export interface IAdminCustomerRepo {
    getCustomers(limit:number,skip:number): Promise<ICustomer[]> | null
    blockCustomer(customerId:string,block:boolean): Promise<ICustomer | null>
}