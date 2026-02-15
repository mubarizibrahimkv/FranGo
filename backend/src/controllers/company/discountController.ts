import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { IDiscountService } from "../../interface/service/companyDiscountServiceInterface";

export class DiscountController {
    constructor(private _discountService: IDiscountService) { }
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

    return res.status(err.status).json({
        success: false,
        message: err.message,
    });
}

    addOffer = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const form = req.body;
            await this._discountService.addOffer(companyId, form);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    addCoupon = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const form = req.body;
            await this._discountService.addCoupon(companyId, form);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    updateOffer = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const id = req.query.id as string;
            const form = req.body;
            await this._discountService.updateOffer(companyId, id, form);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    updateCoupon = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const id = req.query.id as string;
            const form = req.body;
            await this._discountService.updateCoupon(companyId, id, form);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    getOffer = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const page = parseInt(req.query.page as string);
            const searchStr = typeof req.query.search === "string" ? req.query.search : "";
            const { offers, totalPages } = await this._discountService.getOffers(companyId, page, searchStr);
            res.status(HttpStatus.OK).json({ success: true, offers, currentPage: page, totalPages });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    getCoupon = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string);
            const searchStr = typeof req.query.search === "string" ? req.query.search : "";
            const { companyId } = req.params;
            const { coupons, totalPages } = await this._discountService.getCoupons(companyId, page, searchStr);
            res.status(HttpStatus.OK).json({ success: true, coupons, currentPage: page, totalPages });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    deleteOffer = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const id = req.query.id as string;
            await this._discountService.deleteOffer(companyId, id);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
    deleteCoupon = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const id = req.query.id as string;
            await this._discountService.deleteCoupon(companyId, id);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            this.handleError(res, error);
        }
    };
}