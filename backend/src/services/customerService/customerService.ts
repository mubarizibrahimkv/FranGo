import { ICustomerCommerceService } from "../../interface/service/customerCommerceService";
import { IApplicationRepo } from "../../interface/ṛepository/applicationRepoInterface";
import { IStockRepo } from "../../interface/ṛepository/stockRepoInterface";

export class CustomerCommerceService implements ICustomerCommerceService {
    constructor(private _applicationRepo: IApplicationRepo, private _stockRepo: IStockRepo) { }
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
            console.log(products, "products in cuotomer srvice")
            return {
                products,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.log("Error in get products in customer side", error)
            throw error
        }
    }
} 