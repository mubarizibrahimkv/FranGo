import { IAddress } from "../../models/addressModel";
import { IAddressInput } from "../../types/addressInput";

export interface ICustomerRepo {
    addAddress(address: IAddressInput): Promise<IAddress |null>
    editAddress(addressId:string,address: IAddressInput): Promise<IAddress |null>
    deleteAddress(addressId: string): Promise<IAddress |null>
    findById(addressId: string): Promise<IAddress |null>
    getAddressesByCustomer(customerId:string): Promise<IAddress[]>
}