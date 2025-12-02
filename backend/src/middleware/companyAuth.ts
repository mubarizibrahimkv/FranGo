import { Request, Response, NextFunction } from "express";
import Company from "../models/companyModel";
import { verifyToken, AuthenticatedRequest } from "./authMiddleware";
import HttpStatus from "../utils/httpStatusCode";

export const companyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;

  await verifyToken(authReq, res, async () => {
    try {
      if (!authReq.user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });

      const user = await Company.findById(authReq.user.id);
      if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Company not found" });
      if (user.isBlocked)
        return res.status(HttpStatus.FORBIDDEN).json({ message: "Your company account is blocked" });
      next();
    } catch (err) {
      console.error("companyAuth error:", err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  });
};   
  