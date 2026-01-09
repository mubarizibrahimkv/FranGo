import { Request, Response } from "express";
import { IAdminCustomerService } from "../../interface/service/adminCustomerServiceInterface";
import { IAdminCustomerController } from "../../interface/controller/admin/customerControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class AdminCustomerController implements IAdminCustomerController {

    constructor(private _customerService: IAdminCustomerService) { }
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

    res.status(err.status).json({ success: false, message: err.message });
  }

    getCustomers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        try {
             const { customers,totalPages } = await this._customerService.getCustomers(page,searchStr);
            res.status(HttpStatus.OK).json({ success: true, users:customers,currentPage:page,totalPages });
        } catch (error) {
           this.handleError(res, error); 
        }
    };

    blockCustomer = async (req: Request, res: Response) => {
        const { customerId } = req.params;
        const { block } = req.body;
        try {
            const customer = await this._customerService.blockCustomer(customerId, block);
            res.status(HttpStatus.OK).json({ success: true, customer });
        } catch (error) {
            this.handleError(res, error); 
        }
    };
}