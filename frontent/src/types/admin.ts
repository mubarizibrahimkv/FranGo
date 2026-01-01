import type { Company } from "./company";
import type { Investor } from "./investor";

export interface IIndustryCategory {
  _id?: string;
  categoryName: string;
  image?: string | File;
  subCategories: {
    _id?:string
    name: string;
    subSubCategories: { name: string }[];
  }[];
}

export interface ISubSubCategory {
  _id?: string;
  name: string;
}

export interface ISubCategory {
  _id?: string;
  name: string;
  subSubCategories: ISubSubCategory[];
}

export interface ICategory {
  _id: string;
  categoryName: string;
  subCategories: ISubCategory[];
}

export interface IReport {
  _id?: string;
  reportedBy: Investor;
  reportedAgainst: Company;
  status: "pending" | "resolved" | "rejected";
  reason: string;
  createdAt?: Date;
  updatedAt?: Date;
}
