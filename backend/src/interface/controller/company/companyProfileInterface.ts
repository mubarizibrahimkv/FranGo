import { Request, Response } from "express";

export default interface IcompanyProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  reapply(req: Request, res: Response): Promise<void>;
  updateLogo(req: Request, res: Response): Promise<void>;
  changePassword(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;