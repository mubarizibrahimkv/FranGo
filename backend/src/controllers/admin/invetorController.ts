import { Request, Response } from "express";
import { IAdminInvestorController } from "../../interface/controller/admin/investorContrllerInterface";
import { IAdminInvestorService } from "../../interface/service/adminInvestorServiceInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

interface IServiceError {
  message: string;
  status?: number;
}

export class AdminInvestorController implements IAdminInvestorController {
    constructor(private _companyService: IAdminInvestorService) {}

    getPendingInvestors = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string);

        try {
            const { investor, totalPages } = await this._companyService.getPendingInvestors(page);
            res.status(HttpStatus.OK).json({ success: true, users: investor, currentPage: page, totalPages });
        } catch (error: unknown) {
    const serviceError = error as IServiceError;
    const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
    const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
  }
    };

    getApprovedInvestors = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string);

        try {
            const { investor, totalPages } = await this._companyService.getApprovedInvestors(page);
            res.status(HttpStatus.OK).json({ success: true, investors: investor, currentPage: page, totalPages });
        } catch (error: unknown) {
    const serviceError = error as IServiceError;
    const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
    const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
  }
    };

    changeStatusInvestor = async (req: Request, res: Response) => {
        const { investorId } = req.params;
        const { status,reason } = req.body;
     
        try {
            const investor = await this._companyService.changeStatusInvestor(investorId, status,reason);
            res.status(HttpStatus.OK).json({ success: true, investor });
        }catch (error: unknown) {
    const serviceError = error as IServiceError;
    const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
    const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
  }
    };

    blockInvestor = async (req: Request, res: Response) => {
        const { investorId } = req.params;
        const { block } = req.body;

        try {
            const investor = await this._companyService.blockInvestor(investorId, block);
            res.status(HttpStatus.OK).json({ success: true, investor });
        } catch (error: unknown) {
    const serviceError = error as IServiceError;
    const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
    const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
  }
    };

    getInvestorDetails = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const investor = await this._companyService.getInvestorDetails(id);
            res.status(HttpStatus.OK).json({ success: true, investor });
        }catch (error: unknown) {
    const serviceError = error as IServiceError;
    const message = serviceError.message || ERROR_MESSAGES.SERVER_ERROR;
    const status = serviceError.status || HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(status).json({ message });
  }
    };
}
