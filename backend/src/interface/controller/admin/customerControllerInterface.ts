import { Request, Response } from "express";

export interface IAdminCustomerController{
  getCustomers(req: Request, res: Response): Promise<void>;
  blockCustomer(req: Request, res: Response): Promise<void>;
}