import { Request, Response } from "express";
import { ICustomerProfileService } from "../../interface/service/customerProfileService";
import { ICustomerProfileController } from "../../interface/controller/customer/customerProfileControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";

export class CustomerProfileController implements ICustomerProfileController {
    constructor(private _profileService: ICustomerProfileService) { }
    private handleError(res: Response, error: unknown) {

        const err =
            typeof error === "object" &&
                error !== null &&
                "status" in error &&
                "message" in error
                ? (error as { status: number; message: string })
                : error instanceof Error
                    ? { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message }
                    : { status: HttpStatus.INTERNAL_SERVER_ERROR, message: ERROR_MESSAGES.SERVER_ERROR };

    }
    addAddress = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        const { formData } = req.body;
        try {
            await this._profileService.addAddress(customerId, formData);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    getAddress = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        try {
            const addresses = await this._profileService.getAddress(customerId);
            res.status(HttpStatus.OK).json({ success: true, customer: addresses });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    getCustomer = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        try {
            const customer = await this._profileService.getCustomer(customerId);
            res.status(HttpStatus.OK).json({ success: true, customer });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    editAddress = async (req: Request, res: Response) => {
        const { addressId } = req.params;
        const { formData } = req.body;
        try {
            await this._profileService.editAddress(addressId, formData);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    deleteAddress = async (req: Request, res: Response) => {
        const { addressId } = req.params;
        try {
            await this._profileService.deleteAddress(addressId);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;
            const { data } = req.body;

            await this._profileService.changePassword(userId, data.oldPassword, data.newPassword);

            res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY });
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };

}