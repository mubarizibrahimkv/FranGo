import { CustomerDTO } from "../dtos/customer/customer.dto";
import { ICustomer } from "../models/customerModel";

export class CustomerMapper {
  static toDTO(customer: ICustomer): CustomerDTO {
    return {
      _id: customer._id.toString(),
      userName: customer.userName,
      email: customer.email,
      role: customer.role,
      isBlocked: customer.isBlocked,
      isVerifiedByAdmin: customer.isVerifiedByAdmin,
      googleId: customer.googleId,
      isAdmin: customer.isAdmin,
      createdAt: customer.createdAt,
    };
  }
   static toDTOList(customers: ICustomer[]): CustomerDTO[] {
    return customers.map(customer => this.toDTO(customer));
  }
}
