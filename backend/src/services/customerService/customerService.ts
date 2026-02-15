import { ICustomerCommerceService } from "../../interface/service/customerCommerceService";
import { IFranchiseRepo } from "../../interface/ṛepository/franchiseRepoInterface"

export class CustomerCommerceService implements ICustomerCommerceService {
    constructor(private _franchiseRepo: IFranchiseRepo) { }
    getFranchisesByCategory = async (industryCategory: string, page: number, search: string) => {
        try {
            let limit = 10
            const skip = (page - 1) * limit;
            const { data, totalCount } =
                await this._franchiseRepo.findAllByIndustryCategory(
                    industryCategory,
                    limit,
                    skip,
                    search
                );
            return {
                franchises: data,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            console.log("Error in get franchises by category ", error)
            throw error
        }
    }
} 