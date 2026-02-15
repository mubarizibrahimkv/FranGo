import { ICoupon } from "../../models/couponModel";
import { IOffer } from "../../models/offerModel";

export interface IDiscountService{
    addOffer(companyId:string,data:IOffer):Promise<void>
    deleteOffer(companyId:string,offerId:string):Promise<void>
    deleteCoupon(companyId:string,couponId:string):Promise<void>
    addCoupon(companyId:string,data:ICoupon):Promise<void>
    updateCoupon(companyId:string,couponId:string,data:ICoupon):Promise<void>
    updateOffer(companyId:string,offerId:string,data:IOffer):Promise<void>
    getOffers(companyId:string,page:number,searchStr:string):Promise<{offers:IOffer[],totalPages:number}>
    getCoupons(companyId:string,page:number,searchStr:string):Promise<{coupons:ICoupon[],totalPages:number}>
}