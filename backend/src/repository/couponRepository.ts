import { FilterQuery } from "mongoose";
import { ICouponRepo } from "../interface/ṛepository/couponRepositoryInterface";
import Coupon, { ICoupon } from "../models/couponModel";
import { BaseRepository } from "./baseRepository";

export class CouponRepository extends BaseRepository<ICoupon> implements ICouponRepo {
    constructor() {
        super(Coupon);
    }
    async findAllByCompanyId(companyId: string, skip: number, limit: number, search: string) {
        const filter: FilterQuery<ICoupon> = {
            company: companyId,
        };
        if (search) {
            filter.couponCode = { $regex: search, $options: "i" };
        }
        filter.isActive = true;
        const coupons = await Coupon.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalCount = await Coupon.countDocuments(filter);

        return { coupons, totalCount };
    }
    async deleteCoupon(id: string) {
        await Coupon.findByIdAndUpdate(id, { isActive: false });
        return;
    }
    async existsByCode(
        companyId: string,
        couponCode: string,
        excludeId?: string
    ) {
        const filter: FilterQuery<ICoupon> = {
            company: companyId,
            couponCode,
            isActive: true,
        };

        if (excludeId) {
            filter._id = { $ne: excludeId };
        }

        const exists = await Coupon.exists(filter);
        return Boolean(exists);
    }

}