import { Request, Response } from "express";
import { IAdminInvestorController } from "../../interface/controller/admin/investorContrllerInterface";
import { IAdminInvestorService } from "../../interface/service/adminInvestorServiceInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class AdminInvestorController implements IAdminInvestorController {
    constructor(private _companyService: IAdminInvestorService) {}

    getPendingInvestors = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string);

        try {
            const { investor, totalPages } = await this._companyService.getPendingInvestors(page);
            res.status(HttpStatus.OK).json({ success: true, users: investor, currentPage: page, totalPages });
        } catch (error) {
            if (error instanceof Error && "status" in error) {
                res.status((error as any).status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

    getApprovedInvestors = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string);

        try {
            const { investor, totalPages } = await this._companyService.getApprovedInvestors(page);
            res.status(HttpStatus.OK).json({ success: true, investors: investor, currentPage: page, totalPages });
        } catch (error) {
            if (error instanceof Error && "status" in error) {
                res.status((error as any).status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

    changeStatusInvestor = async (req: Request, res: Response) => {
        const { investorId } = req.params;
        const { status,reason } = req.body;
     
        try {
            const investor = await this._companyService.changeStatusInvestor(investorId, status,reason);
            res.status(HttpStatus.OK).json({ success: true, investor });
        } catch (error) {
            if (error instanceof Error && "status" in error) {
                res.status((error as any).status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

    blockInvestor = async (req: Request, res: Response) => {
        const { investorId } = req.params;
        const { block } = req.body;

        try {
            const investor = await this._companyService.blockInvestor(investorId, block);
            res.status(HttpStatus.OK).json({ success: true, investor });
        } catch (error) {
            if (error instanceof Error && "status" in error) {
                res.status((error as any).status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };

    getInvestorDetails = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const investor = await this._companyService.getInvestorDetails(id);
            res.status(HttpStatus.OK).json({ success: true, investor });
        } catch (error) {
            if (error instanceof Error && "status" in error) {
                res.status((error as any).status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
            }
        }
    };
}
