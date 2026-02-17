import { Types } from "mongoose";
import { ICustomerCommerceService } from "../../interface/service/customerCommerceService";
import { IApplicationRepo } from "../../interface/ṛepository/applicationRepoInterface";
import { IOfferRepo } from "../../interface/ṛepository/offerRepositoryInterface";
import { IStockRepo } from "../../interface/ṛepository/stockRepoInterface";
import { DiscountType, IOffer } from "../../models/offerModel";
import { IProduct } from "../../models/productModel";
import {  IStockWithProduct } from "../../models/stockSchema";

interface IStockPopulated {
    product: IProduct;
}

type AppliedOffer = {
    _id: Types.ObjectId;
    offerName: string;
    discountType: DiscountType;
    discountValue: number;
};



export class CustomerCommerceService implements ICustomerCommerceService {
    constructor(private _applicationRepo: IApplicationRepo, private _stockRepo: IStockRepo, private _offerRepo: IOfferRepo) { }
    getFranchisesByCategory = async (industryCategory: string, page: number, search: string) => {
        try {
            let limit = 10
            const skip = (page - 1) * limit;
            const { applications, totalCount } =
                await this._applicationRepo.getApplicationsByIndustryCategory(
                    industryCategory,
                    search,
                    limit,
                    skip,
                );
            console.log(applications, "applications in cuotomer srvice")
            return {
                franchises: applications,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.log("Error in get franchises by category ", error)
            throw error
        }
    }
    getProducts = async (applicationId: string, page: number, search: string) => {
        try {
            let limit = 10
            const skip = (page - 1) * limit;
            const { products, totalCount } =
                await this._stockRepo.getProductsByApplication(
                    applicationId,
                    search,
                    skip,
                    limit,
                );
            const populatedProducts = products as IStockPopulated[];

            const companyId = populatedProducts[0]?.product.company.toString()


            console.log(products, "products in cuotomer srvice")

            const { offers } = await this._offerRepo.findAllByCompanyId(companyId)





            const updatedProducts = (products as IStockWithProduct[]).map(
                (item: IStockWithProduct) => {

                    const product = item.product;

                    let bestDiscount = 0;
                    let bestOffer: AppliedOffer | null = null;

                    offers.forEach((offer: IOffer) => {

                        const isProductMatch =
                            (offer.products ?? []).some((id) =>
                                id.toString() === product._id.toString()
                            );

                        const isCategoryMatch =
                            (offer.categories ?? []).some((id) =>
                                id.toString() === product.productCategory.toString()
                            );

                        if (isProductMatch || isCategoryMatch) {

                            let discountAmount = 0;

                            if (offer.discountType === "PERCENTAGE") {
                                discountAmount =
                                    (product.price * offer.discountValue) / 100;
                            } else {
                                discountAmount = offer.discountValue;
                            }

                            if (discountAmount > bestDiscount) {
                                bestDiscount = discountAmount;

                                bestOffer = {
                                    _id: offer._id,
                                    offerName: offer.offerName,
                                    discountType: offer.discountType,
                                    discountValue: offer.discountValue
                                };
                            }
                        }
                    });

                    const finalPrice = Math.max(product.price - bestDiscount, 0);

                    return {
                        ...item.toObject(),
                        originalPrice: product.price,
                        discount: bestDiscount,
                        finalPrice,
                        appliedOffer: bestOffer
                    };
                }
            );






            return {
                products: updatedProducts,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.log("Error in get products in customer side", error)
            throw error
        }
    }
} 