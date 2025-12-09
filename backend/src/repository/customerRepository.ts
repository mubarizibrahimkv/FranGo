import { Types } from "mongoose";
import { ICustomerRepo } from "../interface/ṛepository/customerRepositoryInterface";
import Address from "../models/addressModel";
import { IAddressInput } from "../types/addressInput";

export class CustomerAddressRepo implements ICustomerRepo {
    async findById(addressId: string) {
        return Address.findById(addressId);
    }
    async addAddress(address: IAddressInput) {
        return await Address.create(address);
    }
    async getAddressesByCustomer(customerId: string) {
        const objectId = new Types.ObjectId(customerId);
        const addresses = await Address.find({ customer: objectId }).sort({ createdAt: -1 });
        return addresses;
    }
    async deleteAddress(addressId: string){
        return await Address.findByIdAndDelete(addressId);
    }
    async editAddress(addressId: string, address: IAddressInput){
        return await Address.findByIdAndUpdate(addressId,address,{new:true});
    }
}