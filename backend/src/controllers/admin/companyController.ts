import { Request, Response } from "express";
import { IAdminCompanyService } from "../../interface/service/adminCompanyServiceInterface";
import { IAdminCompanyController } from "../../interface/controller/admin/companyControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class AdminConmpanyController implements IAdminCompanyController {
    constructor(private _companyService: IAdminCompanyService) { }
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
    getPendingCompanies = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string); 
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        try {
            const {users,totalPages} = await this._companyService.getPendingCompanies(page,searchStr);
            res.status(HttpStatus.OK).json({ success: true, users,currentPage:page,totalPages });
        } catch (err: unknown) {
            this.handleError(res, err);
        }
    }; 
    getApprovedCompanies = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        const filter=req.query.filter as string;
        try {
            const {companies,totalPages} = await this._companyService.getApprovedCompanies(page,searchStr,filter);
            res.status(HttpStatus.OK).json({ success: true, companies,currentPage:page,totalPages });
        } catch (err: unknown) {
            this.handleError(res, err);
        }
    };
    changeStatusCompany = async (req: Request, res: Response) => {
        const { companyId } = req.params;
        const { status,reason } = req.body;
        try {
            if (status !== "approve" && status !== "reject") {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Invalid status" });
                return;
            }
            const companies = await this._companyService.changeStatusCompany(companyId, status,reason);
            res.status(HttpStatus.OK).json({ success: true, companies });
        } catch (err: unknown) {
            this.handleError(res, err);
        }
    };
    blockCompany = async (req: Request, res: Response) => {
        const { companyId } = req.params;
        const { block } = req.body;
        try {
            const companies = await this._companyService.blockCompany(companyId, block);
            res.status(HttpStatus.OK).json({ success: true, companies });
        } catch (err: unknown) {
            this.handleError(res, err);
        }
    };
    getCompanyDetails = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const company = await this._companyService.getCompanyDetails(id);
            res.status(HttpStatus.OK).json({ success: true, company });
        } catch (err: unknown) {
            this.handleError(res, err);
        }
    };
}