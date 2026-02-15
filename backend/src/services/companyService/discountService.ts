import { Types } from "mongoose";
import { Messages } from "../../constants/messages";
import { IDiscountService } from "../../interface/service/companyDiscountServiceInterface";
import { ICompanyProfileRepo } from "../../interface/ṛepository/companyProfileRepositoryInterface";
import { ICouponRepo } from "../../interface/ṛepository/couponRepositoryInterface";
import { IOfferRepo } from "../../interface/ṛepository/offerRepositoryInterface";
import { ICoupon } from "../../models/couponModel";
import { IOffer } from "../../models/offerModel";
import HttpStatus from "../../utils/httpStatusCode";

export class DiscountService implements IDiscountService {
    constructor(private _companyRepo: ICompanyProfileRepo, private _offerRepo: IOfferRepo, private _couponRepo: ICouponRepo) { }
    addOffer = async (companyId: string, data: IOffer) => {
        const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.COMPANY_NOT_FOUND };
        }

        const exists = await this._offerRepo.existsByName(
            companyId,
            data.offerName
        );

        if (exists) {
            throw {
                status: HttpStatus.CONFLICT,
                message: Messages.OFFER_NAME_ALREADY_EXISTS,
            };
        }

        await this._offerRepo.create({
            ...data,
            company: new Types.ObjectId(companyId),
        });
    };

    addCoupon = async (companyId: string, data: ICoupon) => {
        const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.COMPANY_NOT_FOUND };
        }

        const exists = await this._couponRepo.existsByCode(
            companyId,
            data.couponCode
        );

        if (exists) {
            throw {
                status: HttpStatus.CONFLICT,
                message: Messages.COUPON_CODE_ALREADY_EXISTS,
            };
        }

        await this._couponRepo.create({
            ...data,
            company: new Types.ObjectId(companyId),
        });
    };

    updateOffer = async (
        companyId: string,
        offerId: string,
        data: IOffer
    ) => {
        try {
             const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.COMPANY_NOT_FOUND };
        }

        const exists = await this._offerRepo.existsByName(
            companyId,
            data.offerName,
            offerId
        );

        if (exists) {
            throw {
                status: HttpStatus.CONFLICT,
                message: Messages.OFFER_NAME_ALREADY_EXISTS,
            };
        }

        await this._offerRepo.update(offerId, data);
        } catch (error) {
            console.log(error);
            throw error;
        }
       
    };

    updateCoupon = async (
        companyId: string,
        couponId: string,
        data: ICoupon
    ) => {
        const company = await this._companyRepo.findById(companyId);
        if (!company) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.COMPANY_NOT_FOUND };
        }

        const exists = await this._couponRepo.existsByCode(
            companyId,
            data.couponCode,
            couponId
        );

        if (exists) {
            throw {
                status: HttpStatus.CONFLICT,
                message: Messages.COUPON_CODE_ALREADY_EXISTS,
            };
        }

        await this._couponRepo.update(couponId, data);
    };

    getOffers = async (companyId: string, page: number, searchStr: string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const company = await this._companyRepo.findById(companyId);
            if (!company) {
                throw {
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.COMPANY_NOT_FOUND,
                };
            }
            const { offers, totalCount } = await this._offerRepo.findAllByCompanyId(companyId, skip, limit, searchStr);
            const totalPages = Math.ceil(totalCount / limit);
            return { offers, totalPages };
        } catch (error) {
            console.log("Error in get offer :", error);
            throw error;
        }
    };
    getCoupons = async (companyId: string, page: number, searchStr: string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const company = await this._companyRepo.findById(companyId);
            if (!company) {
                throw {
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.COMPANY_NOT_FOUND,
                };
            }
            const { coupons, totalCount } = await this._couponRepo.findAllByCompanyId(companyId, skip, limit, searchStr);
            const totalPages = Math.ceil(totalCount / limit);
            return { coupons, totalPages };
        } catch (error) {
            console.log("Error in get coupon :", error);
            throw error;
        }
    };
    deleteOffer = async (companyId: string, offerId: string) => {
        try {
            const company = await this._companyRepo.findById(companyId);
            if (!company) {
                throw {
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.COMPANY_NOT_FOUND,
                };
            }
            await this._offerRepo.deleteOffer(offerId);
            return;
        } catch (error) {
            console.log("Error in delete offer :", error);
            throw error;
        }
    };
    deleteCoupon = async (companyId: string, couponId: string) => {
        try {
            const company = await this._companyRepo.findById(companyId);
            if (!company) {
                throw {
                    status: HttpStatus.NOT_FOUND,
                    message: Messages.COMPANY_NOT_FOUND,
                };
            }
            await this._couponRepo.deleteCoupon(couponId);
            return;
        } catch (error) {
            console.log("Error in delete coupon :", error);
            throw error;
        }
    };
}