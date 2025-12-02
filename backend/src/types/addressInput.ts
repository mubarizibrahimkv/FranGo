import { Types } from "mongoose";

export interface IAddressInput {
  customer: Types.ObjectId; 
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
  isListed?: boolean;
}

export interface IFilters {
  category: string;
  company: string;
  location: string;
  ownership: string;
  minFee: string;
  maxFee: string;
  sort: string;
  order: "asc" | "desc";
  search?:string
}
