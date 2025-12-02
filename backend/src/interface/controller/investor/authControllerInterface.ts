import { Request, Response } from "express";

export interface IAuthController{
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  refresh(req: Request, res: Response): Promise<void>;
  resendOtp(req:Request,res:Response):Promise<void>
  logoutUser(req:Request,res:Response):Promise<void>
  forgetPassword(req:Request,res:Response):Promise<void>
  changePassword(req:Request,res:Response):Promise<void>
  googleCallBack(req:Request,res:Response):Promise<void>
}