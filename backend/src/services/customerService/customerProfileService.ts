import { ICustomerProfileService } from "../../interface/service/customerProfileService";
import { ICustomerAuthRepo } from "../../interface/ṛepository/customerAuthRepoInterface";
import { ICustomerRepo } from "../../interface/ṛepository/customerRepositoryInterface";
import { IAddress } from "../../models/addressModel";
import { IAddressInput } from "../../types/addressInput";
import bcrypt from "bcrypt";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";

export class CustomerProfileService implements ICustomerProfileService {
    constructor(private _addressRepo: ICustomerRepo, private _customerRepo: ICustomerAuthRepo) { }
    addAddress = async (customerId: string, formData: IAddress) => {
        try {
            const customer = await this._customerRepo.findById(customerId);
            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
            }
            const addressData: IAddressInput = { ...formData, customer: customer._id };

            const newAddress = await this._addressRepo.addAddress(addressData);
            return newAddress;
        } catch (error) {
            throw error;
        }
    };
    getCustomer = async (customerId: string) => {
        try {
            const customer = await this._customerRepo.findById(customerId);
            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
            }

            return customer;
        } catch (error) {
            throw error;
        }
    };
    getAddress = async (customerId: string) => {
        try {
            const addresses = await this._addressRepo.getAddressesByCustomer(customerId);
            return addresses;
        } catch (error) {
            throw error;
        }
    };
    editAddress = async (addressId: string, formData: IAddress) => {
        try {
            const address = await this._addressRepo.findById(addressId);
            if (!address) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
            }
            const updatedAddress = await this._addressRepo.editAddress(addressId, formData);
            if (!updatedAddress) throw { status: HttpStatus.NOT_FOUND, message: Messages.ADDRESS_NOT_FOUND };
            return updatedAddress;
        } catch (error) {
            throw error;
        }
    };
    deleteAddress = async (addressId: string) => {
        try {
            const deleted = await this._addressRepo.deleteAddress(addressId);
            if (!deleted) throw { status: HttpStatus.NOT_FOUND, message: "Address not found" };
            return deleted;
        } catch (error) {
            throw error;
        }
    };
    changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
            const user = await this._customerRepo.findById(userId);
            if (!user) {
                throw new Error(Messages.USER_NOT_FOUND);
            }
            if (!user.password) {
                throw new Error("User password not found");
            }
    
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) throw new Error("Current password is incorrect");
    
    
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new Error("New password cannot be same as current password");
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
    
    
            await user.save();
            return true;
        };

}