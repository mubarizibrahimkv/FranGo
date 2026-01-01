import { ICustomer } from "../../models/customerModel";

export interface IAdminCustomerService {
    getCustomers(page: number,search:string): Promise<{customers: ICustomer[],totalPages: number}>;
    blockCustomer(customerId: string, block: boolean): Promise<void>;
}