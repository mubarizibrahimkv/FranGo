import { Request, Response } from "express";
import { IAdminService } from "../../interface/service/adminServiceInterface";
import { IAdminControler } from "../../interface/controller/admin/adminControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class Admincontroller implements IAdminControler {
    constructor(private _adminService: IAdminService) { }
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
    addIndustryCategory = async (req: Request, res: Response) => {
        try {

            const data = JSON.parse(req.body.data);
            const file = req.file;

            if (file) {
                data.image = file.path;
            }
            await this._adminService.addIndustryCategory(data);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            this.handleError(res,error);
        }
    };
    editIndustryCategory = async (req: Request, res: Response) => {
        try {
            let data = req.body.data;

            if (typeof data === "string") {
                data = JSON.parse(data);
            }

            if (req.file) {
                data.image = req.file.path;
            }

            await this._adminService.editIndustryCategory(data);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };
    getIndustryCategory = async (req: Request, res: Response) => {
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        const page = parseInt(req.query.page as string) || 1;
        const filter = req.query.filter as string;
        try {
            const { industries, totalPages } = await this._adminService.getIndustryCategory(searchStr, page, filter);
            res.status(HttpStatus.OK).json({ success: true, industries, totalPages });
            return;
        } catch (error: unknown) {
           this.handleError(res, error);
        }
    };
    deleteIndustryCategory = async (req: Request, res: Response) => {
        const { categoryId } = req.params;
        try {
            await this._adminService.deleteIndustryCategory(categoryId);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };
    getReports = async (req: Request, res: Response) => {
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        const page = parseInt(req.query.page as string) || 1;
        try {
            const { reports, totalPages } = await this._adminService.getReports(page, searchStr);
            res.status(HttpStatus.OK).json({ success: true, reports, totalPages });
            return;
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };
    getNotifications = async (req: Request, res: Response) => {
        const { userId } = req.params;
        try {
            const notifications = await this._adminService.getNotification(userId);
            res.status(HttpStatus.OK).json({ success: true, notifications });
            return;
        } catch (error: unknown) {
           this.handleError(res, error);
        }
    };
    updateNotification = async (req: Request, res: Response) => {
        const { notificationId } = req.params;
        try {
            await this._adminService.updateNotification(notificationId);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };
}