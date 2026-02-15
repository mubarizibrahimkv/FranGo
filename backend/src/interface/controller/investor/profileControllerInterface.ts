import { Request, Response } from "express";

export default interface IProfileController{
   getProfile(req: Request, res: Response): Promise<void>;
   reapply(req: Request, res: Response): Promise<void>;
  updateProfileImage(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;