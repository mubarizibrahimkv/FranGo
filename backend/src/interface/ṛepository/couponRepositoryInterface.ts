import { ICoupon } from "../../models/couponModel";

export interface ICouponRepo {
    create(data: Partial<ICoupon>): Promise<ICoupon>
    deleteCoupon(id:string): Promise<void>
    update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null>
    findAllByCompanyId(companyId:string, skip: number, limit: number, search: string):Promise<{coupons:ICoupon[],totalCount:number}>
    existsByCode(companyId: string,couponCode: string,excludeId?: string):Promise<boolean>
}