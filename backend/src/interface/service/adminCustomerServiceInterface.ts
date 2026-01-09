import { CustomerDTO } from "../../dtos/customer/customer.dto";
import { ICustomer } from "../../models/customerModel";

export interface IAdminCustomerService {
    getCustomers(page: number,search:string): Promise<{customers: CustomerDTO[],totalPages: number}>;
    blockCustomer(customerId: string, block: boolean): Promise<void>;
}