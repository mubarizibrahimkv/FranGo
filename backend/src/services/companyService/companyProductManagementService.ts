import mongoose, { Types } from "mongoose";
import { ICompanyProductManagementService } from "../../interface/service/companyProductManagementServiceInterface";
import { IIndustryCategoryRepo } from "../../interface/ṛepository/adminIndustryCategoryInterface";
import { IProductCategoryRepo } from "../../interface/ṛepository/productCategoryInterface";
import { ISubCategory, ISubSubCategory } from "../../models/industryCategoryModel";
import { Messages } from "../../constants/messages";
import HttpStatus from "../../utils/httpStatusCode";
import { IProductRepo } from "../../interface/ṛepository/productRepoInterface";

export class ProductManagementService implements ICompanyProductManagementService {
    constructor(private _productCategoryRepo: IProductCategoryRepo, private _industryCategoryRepo: IIndustryCategoryRepo, private _productRepo: IProductRepo) { }
    addProductCategory = async (companyId: string, data: {
        industryCategoryId: string;
        subCategoryId: string;
        subSubCategoryId: string;
        productCategoryName: string;
    }) => {
        try {
            const industry = await this._industryCategoryRepo.findById(data.industryCategoryId);
            if (!industry) {
                throw { success: false, message: Messages.INDUSTRY_CATEGORY_NOT_FOUND };
            }

            const subCategory = industry.subCategories.find(
                (sub: ISubCategory) => sub._id.toString() === data.subCategoryId
            );
            if (!subCategory) {
                throw { success: false, message: Messages.SUBCATEGORY_NOT_FOUND };
            }

            const subSubCategory = subCategory.subSubCategories.find(
                (subsub: ISubSubCategory) => subsub._id.toString() === data.subSubCategoryId
            );
            if (!subSubCategory) {
                throw { success: false, message: Messages.SUBSUBCATEGORY_NOT_FOUND };
            }

            const names = data.productCategoryName
                .split(",")
                .map((n) => n.trim())
                .filter((n) => n.length > 0);

            const createdProducts = [];
            const existingNames: string[] = [];

            for (const name of names) {
                const existing = await this._productCategoryRepo.findByNameAndSubSubCategory(
                    name,
                    data.subSubCategoryId,
                    companyId
                );

                if (!existing) {
                    const product = await this._productCategoryRepo.create({
                        name,
                        company: new mongoose.Types.ObjectId(companyId),
                        industryCategoryId: new mongoose.Types.ObjectId(data.industryCategoryId),
                        subCategoryId: new mongoose.Types.ObjectId(data.subCategoryId),
                        subSubCategoryId: new mongoose.Types.ObjectId(data.subSubCategoryId),
                    });
                    createdProducts.push(product);
                } else {
                    existingNames.push(name);
                }
            }

            if (existingNames.length) {
                return {
                    success: false,
                    message: `Product categories already exist: ${existingNames.join(", ")}`,
                };
            }

            return {
                success: true,
                createdProducts,
                message: "Product categories added successfully",
            };
        } catch (error) {
            console.error("Add Product category Error:", error);
            throw error;
        }
    };
    async getAllProductCategories(companyId: string,search:string,filter?:string) {
        try {
            const products = await this._productCategoryRepo.findAllWithCategoryHierarchy(companyId,search,filter);
            return products;
        } catch (error) {
            console.error("Get all Product category Error:", error);
            throw error;  
        }
    }
    async editProductCategory(companyId: string, categoryId: string, newName: string) {
        try {
            const existingCategory = await this._productCategoryRepo.findById(categoryId);
            if (!existingCategory) {
                throw { success: false, message: Messages.CATEGORY_NOT_FOUND };
            }
            const duplicate = await this._productCategoryRepo.findByNameAndSubSubCategory(
                newName,
                existingCategory.subSubCategoryId.toString(),
                companyId
            );
            console.log(duplicate);
            if (duplicate?._id && duplicate._id.toString() !== categoryId) {
                throw { success: false, message: "A category with this name already exists" };
            }

            const updatedCategory = await this._productCategoryRepo.updateCategory(companyId, categoryId, newName);
            if (!updatedCategory) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.UPDATE_FAILED };
            }
            return updatedCategory;
        } catch (error) {
            console.error("Edit Product category Error:", error);
            throw error;
        }
    }
    async deleteProductCategory(companyId: string, categoryId: string) {
        try {
            const deletedCategory = await this._productCategoryRepo.deleteCategory(companyId, categoryId);
            if (!deletedCategory) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.DELETE_FAILED };
            }
            return deletedCategory;
        } catch (error) {
            console.error("Delete Product category Error:", error);
            throw error;
        }
    }
    addProduct = async (
        companyId: string,
        category: string,
        name: string,
        price: string,
        description: string,
        imagePaths: string[]
    ) => {
        try {
            if (!companyId || !category || !name || !price || !description) {
                throw new Error("Missing required fields");
            }

            const pr = Number(price);
            if (isNaN(pr)) throw new Error("Price must be a number");

            if (!Types.ObjectId.isValid(companyId)) throw new Error("Invalid companyId");
            if (!Types.ObjectId.isValid(category)) throw new Error("Invalid categoryId");

            const productCategory = await this._productCategoryRepo.findById(category);
            if (!productCategory) throw new Error("Product category not found");

            const duplicate = await this._productRepo.findDuplicateProduct(
                "",
                companyId,
                category,
                name
            );

            if (duplicate) {
                throw new Error("A product with this name already exists in this category");
            }

            const data = {
                company: new Types.ObjectId(companyId),
                productCategory: new Types.ObjectId(category),
                industryCategory: productCategory?.industryCategoryId,
                name,
                price: pr,
                description,
                images: imagePaths || [],
                isListed: true,
                status: "active" as const,
            };
            const product = await this._productRepo.create(data);

            return product;
        } catch (error) {
            console.error("Add Product Error:", error);
            throw error;
        }
    };
    editProduct = async (
        companyId: string,
        productId: string,
        category: string,
        name: string,
        price: string,
        description: string,
        newImagePaths: string[],
        removedImages: string[]
    ) => {
        try {
            const existingProduct = await this._productRepo.findById(productId);
            if (!existingProduct) throw new Error("Product not found");

            const duplicate = await this._productRepo.findDuplicateProduct(
                productId,
                companyId,
                category,
                name
            );

            if (duplicate) {
                throw new Error("Product with same name already exists.");
            }


            let finalImages = existingProduct.images.filter(
                (img: string) => !removedImages.includes(img)
            );

            if (newImagePaths.length > 0) {
                finalImages.push(...newImagePaths);
            }

            finalImages = finalImages.slice(0, 3);

            const updatedProduct = await this._productRepo.update(productId, {
                productCategory: new Types.ObjectId(category),
                industryCategory: existingProduct.industryCategory,
                name,
                price: Number(price),
                description,
                images: finalImages,
            });

            if (!updatedProduct) throw new Error("Product not updated");
            return updatedProduct;

        } catch (err) {
            console.error("Update Product Error:", err);
            throw err;
        }
    };
    deleteProduct = async (productId: string) => {
        try {
            const product = await this._productRepo.delete(productId);
            if (!product) {
                throw new Error("Product not found");
            } return product;
        } catch (error) {
           console.error("Delete Product Error:", error);
            throw error;
        }
    };
    getProducts = async (companyId: string, page: number,search:string,filter?:string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const totalProducts = await this._productRepo.countByCompanyId(companyId);
            const products = await this._productRepo.findByCompanyId(companyId, skip, limit,search,filter);
            if (!products) {
                throw { status: HttpStatus.BAD_REQUEST, message: "Cannot find Products" };
            }
            const totalPages = Math.ceil(totalProducts / limit);
            return { products, totalPages };
        } catch (error) {
            console.error("Get Products Error:", error);
            throw error;
        }
    };
}