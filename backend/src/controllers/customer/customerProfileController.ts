import { Request, Response } from "express";
import { ICustomerProfileService } from "../../interface/service/customerProfileService";
import { ICustomerProfileController } from "../../interface/controller/customer/customerProfileControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";

export class CustomerProfileController implements ICustomerProfileController {
    constructor(private _profileService: ICustomerProfileService) { }
    addAddress = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        const { formData } = req.body;
        try {
            await this._profileService.addAddress(customerId, formData);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : Messages.CREATE_FAILED,
            });
        }
    };
    getAddress = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        try {
            const addresses = await this._profileService.getAddress(customerId);
            res.status(HttpStatus.OK).json({ success: true, customer: addresses });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : Messages.FETCH_SUCCESS,
            });
        }
    };
    getCustomer = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        try {
            const customer = await this._profileService.getCustomer(customerId);
            res.status(HttpStatus.OK).json({ success: true, customer });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : Messages.FETCH_SUCCESS,
            });
        }
    };
    editAddress = async (req: Request, res: Response) => {
        const { addressId } = req.params;
        const { formData } = req.body;
        try {
           await this._profileService.editAddress(addressId, formData);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : Messages.UPDATE_FAILED,
            });
        }
    };
    deleteAddress = async (req: Request, res: Response) => {
        const { addressId } = req.params;
        try {
           await this._profileService.deleteAddress(addressId);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error instanceof Error ? error.message : Messages.DELETE_FAILED,
            });
        }
    };
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { data } = req.body;

            await this._profileService.changePassword(userId, data.oldPassword, data.newPassword);

            res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY });
        } catch (error: unknown) {
            console.error("Change password error:", error);
            const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
            res.status(HttpStatus.BAD_REQUEST).json({ message });
        }
    };

}