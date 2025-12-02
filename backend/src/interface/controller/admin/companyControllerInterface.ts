import { Request, Response } from "express";

export interface IAdminCompanyController{
  getPendingCompanies(req: Request, res: Response): Promise<void>;
  getApprovedCompanies(req: Request, res: Response): Promise<void>;
  changeStatusCompany(req: Request, res: Response): Promise<void>;
  blockCompany(req: Request, res: Response): Promise<void>;
  getCompanyDetails(req: Request, res: Response): Promise<void>;
}