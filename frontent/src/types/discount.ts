export type DiscountType = "PERCENTAGE" | "FLAT";

export type DiscountApplicableOn = "PRODUCT" | "CATEGORY";

interface IBaseDiscount {
  _id?: string;
  company: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  applicableOn: DiscountApplicableOn;
  products?: string[];
  categories?: string[];
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOffer extends IBaseDiscount {
  offerName: string;
}

export interface ICoupon extends IBaseDiscount {
  couponCode: string;
  minOrderValue?: number;
}
