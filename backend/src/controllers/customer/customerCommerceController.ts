import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ICustomerCommerceService } from "../../interface/service/customerCommerceService";
import HttpStatus from "../../utils/httpStatusCode";
import { Request, Response } from "express";


export class CustomerCommerceController {
    constructor(private _customerCommerceService: ICustomerCommerceService) { }
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

    getFranchisesByCategory = async (req: Request, res: Response) => {
        const { industryCategoryId, page = "1", search = "" } = req.query;
        if (!industryCategoryId) {
            res.status(HttpStatus.OK).json({ message: "industryCategoryId required" });
        }
        const pageNumber = Number(page);
        console.log(industryCategoryId, page, search, "oayhfnbc ")
        try {
            const { franchises, totalPages } =
                await this._customerCommerceService.getFranchisesByCategory(
                    industryCategoryId as string,
                    pageNumber,
                    search as string
                );
            res.status(HttpStatus.OK).json({franchises,totalPages,currentPage:page});
        } catch (error: unknown) {
            this.handleError(res, error);
        }
    };
}