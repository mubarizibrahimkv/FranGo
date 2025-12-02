import { ICompany } from "../models/companyModel";

export interface CompanySerivceResponse {
  company: ICompany;
  message?: string;
}