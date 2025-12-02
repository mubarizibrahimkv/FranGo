import { IAddress } from "../../models/addressModel";
import { ICustomer } from "../../models/customerModel";

export interface ICustomerProfileService{
    addAddress(customerId:string,formData:IAddress):Promise<IAddress|null>
    getCustomer(customerId:string):Promise<ICustomer|null>
    getAddress(customerId:string): Promise<IAddress[]>;
    editAddress(addressId:string,formData:IAddress): Promise<IAddress>;
    deleteAddress(addressId:string): Promise<IAddress>;
    changePassword(userId:string,oldPassword:string,newPassword:string):Promise<boolean>
}