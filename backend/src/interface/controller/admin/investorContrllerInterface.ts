import { Request, Response } from "express";

export interface IAdminInvestorController{
  getPendingInvestors(req: Request, res: Response): Promise<void>;
  getApprovedInvestors(req: Request, res: Response): Promise<void>;
  changeStatusInvestor(req: Request, res: Response): Promise<void>;
  blockInvestor(req: Request, res: Response): Promise<void>;
  getInvestorDetails(req: Request, res: Response): Promise<void>;
}