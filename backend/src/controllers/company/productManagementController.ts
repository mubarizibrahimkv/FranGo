import { Request, Response } from "express";
import { ICompanyProductManagementService } from "../../interface/service/companyProductManagementServiceInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class ProductManagementController {
    constructor(private _productManagementService: ICompanyProductManagementService) { }

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
  
    addProductCategory = async (req: Request, res: Response) => {
        const { companyId } = req.params;
        const { data } = req.body;
        try {
            const { success, message } = await this._productManagementService.addProductCategory(companyId, data);
            res.status(HttpStatus.OK).json({ success, message });
        } catch (error: unknown) {
             this.handleError(res, error); 
        }
    };

    getAllProductCategories = async (req: Request, res: Response) => {
        const { companyId } = req.params;
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        const filter=req.query.filter as string;
        try {
            const data = await this._productManagementService.getAllProductCategories(companyId, searchStr,filter);
            res.status(HttpStatus.OK).json({ success: true, data });
        } catch (error: unknown) {
            this.handleError(res, error); 
        }
    };
    deleteProductCategories = async (req: Request, res: Response) => {
        const { companyId, categoryId } = req.params;
        try {
            await this._productManagementService.deleteProductCategory(companyId, categoryId);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error: unknown) {
             this.handleError(res, error); 
        }
    };
    editProductCategories = async (req: Request, res: Response) => {
        const { companyId, categoryId } = req.params;
        const { newName } = req.body;
        try {
            const data = await this._productManagementService.editProductCategory(companyId, categoryId, newName);
            res.status(HttpStatus.OK).json({ success: true, data });
        } catch (error: unknown) {
            this.handleError(res, error); 
        }
    };
    addProduct = async (req: Request, res: Response) => {
        try {
            const { companyId } = req.params;
            const { category, name, price, description } = req.body;
            const files = req.files as Express.Multer.File[];
            const imagePaths = files?.map((file) => file.path);
            const product = await this._productManagementService.addProduct(companyId, category, name, price, description, imagePaths);
            res.status(HttpStatus.OK).json({ success: true, product });
        } catch (error: unknown) {
           this.handleError(res, error); 
        }
    };

    getProducts = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string);
        const searchStr = typeof req.query.search === "string" ? req.query.search : "";
        const filter=req.query.filter as string;
        try {
            const { companyId } = req.params;
            const { products, totalPages } = await this._productManagementService.getProducts(companyId, page, searchStr,filter);
            res.status(HttpStatus.OK).json({ success: true, products, currentPage: page, totalPages });
        } catch (error: unknown) {
             this.handleError(res, error); 
        }
    };

    editProduct = async (req: Request, res: Response) => {
        try {
            const { companyId, productId } = req.params;
            const { category, name, price, description, removedImages: removedImagesRaw } = req.body;

            let removedImages = removedImagesRaw;

            if (removedImages) {
                try {
                    removedImages = JSON.parse(removedImages);
                } catch (err) {
                    console.log(err);
                    removedImages = [];
                }
            } else {
                removedImages = [];
            } 

            const files = req.files as Express.Multer.File[];

            const newImagePaths = files?.map((file) => file.path) || [];
            const updatedProduct =
                await this._productManagementService.editProduct(
                    companyId,
                    productId,
                    category,
                    name,
                    price,
                    description,
                    newImagePaths,
                    removedImages
                );

            res.status(HttpStatus.OK).json({

                success: true,
                product: updatedProduct,
            });

        } catch (error: unknown) {
            this.handleError(res, error); 
        }
    };

    deleteProduct = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            await this._productManagementService.deleteProduct(productId);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error: unknown) {
           this.handleError(res, error); 
        }
    };
}