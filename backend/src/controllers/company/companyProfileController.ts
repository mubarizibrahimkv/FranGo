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

  getProfile = async (req: Request, res: Response) => {
    const { companyId } = req.params;

    try {
      const  company  = await this._companyService.getProfiles(companyId);
      res.status(HttpStatus.OK).json({
        success: true,
        data: company,
        message: Messages.FETCH_SUCCESS,
      });
    } catch (error) {
      this.handleError(res, error); 
    }
  };


  reapply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { companyId } = req.params;
      await this._companyService.reapply(companyId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
      this.handleError(res, error); 
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

      await this._companyService.updateLogo(file.path, companyId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Logo updated successfully",
      });
    } catch (error) {
       this.handleError(res, error); 
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
      this.handleError(res, error); 
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { data } = req.body;

      await this._companyService.changePassword(userId, data.oldPassword, data.newPassword);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };

  getFranchise = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string);
    const searchStr = typeof req.query.search === "string" ? req.query.search : "";     
    const filter: Record<string, string> = {};

  if (typeof req.query.industrySubCategory === "string") {
    filter.industrySubCategory = req.query.industrySubCategory;
  }

  if (typeof req.query.ownershipModel === "string") {
    filter.ownershipModel = req.query.ownershipModel;
  }

  if (typeof req.query.minInvestment === "string") {
    filter.minInvestment = req.query.minInvestment;
  }

  if (typeof req.query.maxInvestment === "string") {
    filter.maxInvestment = req.query.maxInvestment;
  }
    try {
      const { companyIndustryCategory, franchises, totalPages } = await this._companyService.getFranchises(companyId, page, searchStr,filter);
      res.status(HttpStatus.OK).json({ success: true, companyIndustryCategory, franchises, currentPage: page, totalPages });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };

  addFranchise = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const { data } = req.body;
    try {
      await this._companyService.addFranchise(companyId, data);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_CREATED });
    } catch (error: unknown) {
       this.handleError(res, error); 
    }
  };

  editFranchise = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    const data = req.body;
    try {
      await this._companyService.editFranchise(franchiseId, data);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_UPDATED });
    } catch (error: unknown) {
       this.handleError(res, error); 
    }
  };

  deleteFranchise = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    try {
      await this._companyService.deleteFranchise(franchiseId);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.FRANCHISE_DELETED });
    } catch (error: unknown) {
       this.handleError(res, error); 
    }
  };

  franchiseDetails = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    try {
      const franchise = await this._companyService.franchiseDetails(franchiseId);
      res.status(HttpStatus.OK).json({ success: true, franchise });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };


  getApplications = async (req: Request, res: Response): Promise<void> => {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string);
    const searchStr = typeof req.query.search === "string" ? req.query.search : "";
    const filter: Record<string, string> = {};

    if (typeof req.query.status === "string") {
      filter.status = req.query.status;
    }

    if (typeof req.query.subCategoryId === "string") {
      filter.subCategoryId = req.query.subCategoryId;
    }

    try {
      const { application, totalPages } = await this._companyService.getApplications(companyId, page, searchStr, filter);
      res.status(HttpStatus.OK).json({ success: true, application, currentPage: page, totalPages });
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };


  changeApplicationStatus = async (req: Request, res: Response): Promise<void> => {
    const { applicationId } = req.params;
    const { status } = req.body;
    try {
      await this._companyService.changeApplicationStatus(applicationId, status);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
       this.handleError(res, error); 
    }
  };


  createSubscription = async (req: Request, res: Response) => {
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
       this.handleError(res, error); 
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
      this.handleError(res, error); 
    }
  };
  getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const notifications = await this._companyService.getNotification(userId);
      res.status(HttpStatus.OK).json({ success: true, notifications });
      return;
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };
  updateNotification = async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    try {
      await this._companyService.updateNotification(notificationId);
      res.status(HttpStatus.OK).json({ success: true });
      return;
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };
  getSubscriptionStatus = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    try {
      const status=await this._companyService.getSubscriptionStatus(companyId);
      res.status(HttpStatus.OK).json({ success: true,status });
      return;
    } catch (error: unknown) {
      this.handleError(res, error); 
    }
  };
}
