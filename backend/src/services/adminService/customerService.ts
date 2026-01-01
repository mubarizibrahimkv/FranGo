import { Messages } from "../../constants/messages";
import { IAdminCustomerService } from "../../interface/service/adminCustomerServiceInterface";
import { IAdminCustomerRepo } from "../../interface/ṛepository/adminCustomerRepoInterface";
import Customer from "../../models/customerModel";

export class AdminCustomerService implements IAdminCustomerService {
  constructor(private _customerRepo: IAdminCustomerRepo) {}

  getCustomers = async (page: number,search:string) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const totalCustomers = await Customer.countDocuments();
      const customers = await this._customerRepo.getCustomers(limit, skip,search);
      const totalPages = Math.ceil(totalCustomers / limit);

      if (!customers) {
        throw new Error(Messages.CUSTOMER_NOT_FOUND);
      }

      return { customers, totalPages };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to fetch customers");
    }
  };

  blockCustomer = async (customerId: string, block: boolean) => {
    try {
      const customer = await this._customerRepo.blockCustomer(customerId, block);
      if (!customer) {
        throw new Error(Messages.CUSTOMER_NOT_FOUND);
      }
      return;
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to block/unblock customer");
    }
  };
}
