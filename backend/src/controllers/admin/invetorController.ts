import { Request, Response } from "express";
import { IAdminInvestorController } from "../../interface/controller/admin/investorContrllerInterface";
import { IAdminInvestorService } from "../../interface/service/adminInvestorServiceInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";


export class AdminInvestorController implements IAdminInvestorController {
  constructor(private _companyService: IAdminInvestorService) { }
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

  getPendingInvestors = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const searchStr = typeof req.query.search === "string" ? req.query.search : "";
    try {
      const { investor, totalPages } = await this._companyService.getPendingInvestors(page,searchStr);
      res.status(HttpStatus.OK).json({ success: true, users: investor, currentPage: page, totalPages });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };

  getApprovedInvestors = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const searchStr = typeof req.query.search === "string" ? req.query.search : "";
    try {
      const { investor, totalPages } = await this._companyService.getApprovedInvestors(page,searchStr);
      res.status(HttpStatus.OK).json({ success: true, investors: investor, currentPage: page, totalPages });
    } catch (error: unknown) {
     this.handleError(res, error); 
    }
  };

  changeStatusInvestor = async (req: Request, res: Response) => {
    const { investorId } = req.params;
    const { status, reason } = req.body;
    try {
      const investor = await this._companyService.changeStatusInvestor(investorId, status, reason);
      res.status(HttpStatus.OK).json({ success: true, investor });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };

  blockInvestor = async (req: Request, res: Response) => {
    const { investorId } = req.params;
    const { block } = req.body;
    try {
      const investor = await this._companyService.blockInvestor(investorId, block);
      res.status(HttpStatus.OK).json({ success: true, investor });
    } catch (error: unknown) {
     this.handleError(res, error); 
    }
  };

  getInvestorDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const investor = await this._companyService.getInvestorDetails(id);
      res.status(HttpStatus.OK).json({ success: true, investor });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };
}
