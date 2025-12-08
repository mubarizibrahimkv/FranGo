import { Request, Response } from "express";
import { IInvestorService } from "../../interface/service/investorServiceInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class InvestorController {
  constructor(private _investorService: IInvestorService) { }

  private handleError(res: Response, error: unknown, context: string) {

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

  getFranchises = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string);
    const {
      category = "",
      company = "",
      location = "",
      ownership = "",
      minFee = "",
      maxFee = "",
      sort = "",
      order = "asc",
      search = "",
    } = req.query;

    try {
      const filters = {
        category: category as string,
        company: company as string,
        location: location as string,
        ownership: ownership as string,
        minFee: minFee as string,
        maxFee: maxFee as string,
        sort: sort as string,
        order: (order as "asc" | "desc") || "asc",
        search: search as string,
      };

      const { franchises, totalPages, totalFranchises } =
        await this._investorService.getFranchises(filters, page);

      res.status(HttpStatus.OK).json({
        success: true,
        franchises,
        totalPages,
        currentPage: page,
        totalFranchises,
      });
    } catch (error: unknown) {
      this.handleError(res, error, "getFranchises");
    }
  };

  getFranchiseDetails = async (req: Request, res: Response): Promise<void> => {
    const { franchiseId } = req.params;
    try {
      const franchise = await this._investorService.getFranchiseDetails(franchiseId);
      res.status(HttpStatus.OK).json({ success: true, franchise });
    } catch (error: unknown) {
      this.handleError(res, error, "getFranchiseDetails");
    }
  };

  createApplication = async (req: Request, res: Response): Promise<void> => {
    const { investorId, franchiseId } = req.params;
    const { formData } = req.body;

    try {
      const application = await this._investorService.createApplication(
        formData,
        investorId,
        franchiseId
      );

      res.status(HttpStatus.OK).json({ success: true, application });
    } catch (error: unknown) {
      this.handleError(res, error, "createApplication");
    }
  };

  getApplications = async (req: Request, res: Response): Promise<void> => {
    const { investorId } = req.params;
    const page = parseInt(req.query.page as string);

    try {
      const { application, totalPages } = await this._investorService.getApplications(
        investorId,
        page
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, application, currentPage: page, totalPages });
    } catch (error: unknown) {
      this.handleError(res, error, "getApplications");
    }
  };
  payAdvance = async (req: Request, res: Response): Promise<void> => {
    const { investorId, applicationId } = req.params;
    const { data } = req.body;

    try {
      const { order, key } = await this._investorService.payAdvance(investorId, applicationId, data);
      res.status(HttpStatus.OK).json({ success: true, order, key });
    } catch (error) {
      this.handleError(res, error, "payAdvance");
    }
  };


  verifyPayAdvance = async (req: Request, res: Response): Promise<void> => {
    const { investorId, applicationId } = req.params;
    const { paymentId, orderId, signature, amount } = req.body;

    try {
      const result = await this._investorService.verifyPayAdvance(investorId, applicationId, paymentId, orderId, signature, amount);
      res.status(HttpStatus.OK).json({ success: true, result });
    } catch (error) {
      this.handleError(res, error, "verifyPayAdvance");
    }
  };

  applyReport = async (req: Request, res: Response) => {
    console.log("applyreport working constroller");
    try {
      const { investorId } = req.params;
      const { franchiseId, reason } = req.body;
      await this._investorService.applyReport(franchiseId, investorId, reason);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
      this.handleError(res, error, "Apply Report");
    }
  };
  getNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const notifications = await this._investorService.getNotification(userId);
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
      await this._investorService.updateNotification(notificationId);
      res.status(HttpStatus.OK).json({ success: true });
      return;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("updatenotification error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
      return;
    }
  };
  getMyFranchises = async (req: Request, res: Response) => {
    const { investorId } = req.params;
    try {
      const franchises = await this._investorService.getMyFranchises(investorId);
      res.status(HttpStatus.OK).json({ success: true, franchises });
      return;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("getting my franchises error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
      return;
    }
  };
}
 