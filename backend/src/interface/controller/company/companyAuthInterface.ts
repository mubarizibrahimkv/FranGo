import { Request, Response } from "express";

export interface ICompanyAuthController{
  register(req: Request, res: Response): Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  resendLink(req: Request, res: Response): Promise<void>;
  forgotPassword(req:Request,res:Response):Promise<void>
  changePassword(req:Request,res:Response):Promise<void>
  getGoogleUser(req:Request,res:Response):Promise<void>
} 