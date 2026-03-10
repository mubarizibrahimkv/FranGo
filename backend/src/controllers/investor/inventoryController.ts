import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { IInvestorInventoryService } from "../../interface/service/investorInventoryServiceInterface";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

export class InventoryController {
    constructor(private _inventoryService: IInvestorInventoryService) { }
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
    getProducts = async (req: Request, res: Response) => {
        const { companyId, applicationId } = req.params;
        const page = parseInt(req.query.page as string);
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        try {
            const { products, totalPages } = await this._inventoryService.getProducts(companyId, applicationId, page, searchStr)
            res.status(HttpStatus.OK).json({ success: true, products, currentPage: page, totalPages });
        } catch (error) {
            this.handleError(res, error);
        }
    }
    updateStock = async (req: Request, res: Response): Promise<void> => {
        const authReq = req as AuthenticatedRequest;

        const investorId = authReq.user?.id;
        if (!investorId) {
            res.status(HttpStatus.OK).json({ message: "productId, quantity, and applicationId are required" });
            return
        }
        const { applicationId, productId, quantity } = req.body;
          console.log(productId,quantity,applicationId,investorId,"productId,stock,applicationId,investorId in controller")
        try {
            const stock = await this._inventoryService.updateStock(productId, quantity, applicationId, investorId);
            res.status(HttpStatus.OK).json({
                success: true,
                message: "Stock updated successfully",
                data: stock,
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }
}