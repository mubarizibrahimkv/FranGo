import { ICustomer } from "../../models/customerModel";

export interface IAdminCustomerService {
    getCustomers(page: number): Promise<{customers: ICustomer[],totalPages: number}>;
    blockCustomer(customerId: string, block: boolean): Promise<void>;
}