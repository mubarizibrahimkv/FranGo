import { Request, Response } from "express";
import { IAdminService } from "../../interface/service/adminServiceInterface";
import { IAdminControler } from "../../interface/controller/admin/adminControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";

export class Admincontroller implements IAdminControler {
    constructor(private _adminService: IAdminService) { }
    addIndustryCategory = async (req: Request, res: Response) => {
        try {

            const data = JSON.parse(req.body.data); // ✅ FIXED
            const file = req.file;

            if (file) {
                data.image = file.path; 
            }
            await this._adminService.addIndustryCategory(data);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("addIndustryCategory error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
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
            const message = error instanceof Error ? error.message : String(error);
            console.error("edtIndustryCategory error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
    getIndustryCategory = async (req: Request, res: Response) => {
        try {
            const industries = await this._adminService.getIndustryCategory();
            res.status(HttpStatus.OK).json({ success: true, industries });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("getIndustryCategory error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
    deleteIndustryCategory = async (req: Request, res: Response) => {
        const { categoryId } = req.params;
        try {
            await this._adminService.deleteIndustryCategory(categoryId);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("getIndustryCategory error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
    getReports = async (req: Request, res: Response) => {
        try {
            const reports = await this._adminService.getReports();
            res.status(HttpStatus.OK).json({ success: true, reports });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("getreports error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
    getNotifications = async (req: Request, res: Response) => {
        const {userId}=req.params;
        try {
            const notifications = await this._adminService.getNotification(userId);
            res.status(HttpStatus.OK).json({ success: true, notifications });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("getnotification error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
    updateNotification = async (req: Request, res: Response) => {
    const { notificationId } = req.params;
        try {
            await this._adminService.updateNotification(notificationId);
            res.status(HttpStatus.OK).json({ success: true });
            return;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("updatenotification error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
            return;
        }
    };
}