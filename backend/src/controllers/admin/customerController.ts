import { Request, Response } from "express";
import { IAdminCustomerService } from "../../interface/service/adminCustomerServiceInterface";
import { IAdminCustomerController } from "../../interface/controller/admin/customerControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";

export class AdminCustomerController implements IAdminCustomerController {

    constructor(private _customerService: IAdminCustomerService) { }

    getCustomers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        try {
             const { customers,totalPages } = await this._customerService.getCustomers(page);
            res.status(HttpStatus.OK).json({ success: true, users:customers,currentPage:page,totalPages });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("getCustomers error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };

    blockCustomer = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        const { block } = req.body;
        try {
            const customer = await this._customerService.blockCustomer(customerId, block);
            res.status(HttpStatus.OK).json({ success: true, customer });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("blockCustomer error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
}