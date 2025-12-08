import { Request, Response } from "express";
import IcompanyService from "../../interface/service/companyProfileInterface";
import IcompanyProfileController from "../../interface/controller/company/companyProfileInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

export class ProfileController implements IcompanyProfileController {
  constructor(private _companyService: IcompanyService) { }

  getProfile = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    try {
      const { company, message } = await this._companyService.getProfiles(companyId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: company,
        message: message || Messages.FETCH_SUCCESS,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : Messages.FETCH_FAILED,
      });
    }
  };


  reapply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { companyId } = req.params;
      await this._companyService.reapply(companyId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.UPDATE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };


  updateLogo = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    try {
      const file = req.file;
      if (!file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: Messages.NO_FILE_UPLOADED,
        });
        return;
      }

      const updatedCompany = await this._companyService.updateLogo(file.path, companyId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: updatedCompany,
        message: "Logo updated successfully",
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to update logo",
      });
    }
  };

  updateProfile = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { companyData } = req.body;

    try {
      const updatedCompany = await this._companyService.updateProfile(companyData, companyId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: updatedCompany,
        message: Messages.PROFILE_UPDATED_SUCCESSFULLY,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to update company profile",
      });
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { data } = req.body;

      await this._companyService.changePassword(userId, data.oldPassword, data.newPassword);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY });
    } catch (error: unknown) {
      console.error("Change password error:", error);
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  };

  getFranchise = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string);

    try {
      const { companyIndustryCategory, franchises, totalPages } = await this._companyService.getFranchises(companyId, page);
      res.status(HttpStatus.OK).json({ success: true, companyIndustryCategory, franchises, currentPage: page, totalPages });
    } catch (error: unknown) {
      console.error("Get franchise error:", error);
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  };

  addFranchise = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const { data } = req.body;
    try {
      await this._companyService.addFranchise(companyId, data);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_CREATED });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.CREATE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  };

  editFranchise = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    const data = req.body;
    try {
      await this._companyService.editFranchise(franchiseId, data);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_UPDATED });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.UPDATE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  };

  deleteFranchise = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    try {
      await this._companyService.deleteFranchise(franchiseId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_DELETED });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.DELETE_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
    }
  };

  franchiseDetails = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    try {
      const franchise = await this._companyService.franchiseDetails(franchiseId);
      res.status(HttpStatus.OK).json({ success: true, franchise });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errObj = error as { status?: number; message?: string };
        res
          .status(errObj.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: errObj.message || Messages.FRANCHISE_FETCH_FAILED });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: Messages.FRANCHISE_FETCH_FAILED });
      }
    }
  };


  getApplications = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string);
    try {
      const { application, totalPages } = await this._companyService.getApplications(companyId, page);
      res.status(HttpStatus.OK).json({ success: true, application, currentPage: page, totalPages });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errObj = error as { status?: number; message?: string };
        res
          .status(errObj.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: errObj.message || Messages.FRANCHISE_FETCH_FAILED });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: Messages.FRANCHISE_FETCH_FAILED });
      }
    }
  };


  changeApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const { status } = req.body;
    try {
      const application = await this._companyService.changeApplicationStatus(applicationId, status);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        const errObj = error as { status?: number; message?: string };
        res
          .status(errObj.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: errObj.message || Messages.FRANCHISE_FETCH_FAILED });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: Messages.FRANCHISE_FETCH_FAILED });
      }
    }
  };


  createSubscription = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { amount } = req.body;
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET_KEY,
      });
      const order = await razorpay.orders.create({
        amount: Number(amount) * 100,
        currency: "INR",
        // payment_capture: 1, 
      });

      res.status(HttpStatus.OK).json({
        success: true, order,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error: unknown) {
      console.error("Error pay advance:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };

  verifySubscription = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { paymentId, orderId, signature, amount } = req.body;
    try {
      const verified = await this._companyService.verifyPayment(
        companyId,
        paymentId,
        orderId,
        signature,
        amount
      );

      if (!verified) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Payment verification failed" });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, message: "Subscription activated" });
    } catch (error: unknown) {
      console.error("Error pay advance:", error);
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
  getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const notifications = await this._companyService.getNotification(userId);
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
      await this._companyService.updateNotification(notificationId);
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
