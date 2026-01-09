import { Request, Response, NextFunction } from "express";
import Company from "../models/companyModel";
import { verifyToken, AuthenticatedRequest } from "./authMiddleware";
import HttpStatus from "../utils/httpStatusCode";
import { Messages } from "../constants/messages";

export const companyAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;

  await verifyToken(authReq, res, async () => {
    try {
      if (!authReq.user) return res.status(HttpStatus.UNAUTHORIZED).json({ message:Messages.UNAUTHORIZED_ACCESS });

      const user = await Company.findById(authReq.user.id);
      if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ message:Messages.COMPANY_NOT_FOUND });
      if (user.isBlocked)
        return res.status(HttpStatus.FORBIDDEN).json({ message: Messages.ACCOUNT_BLOCKED });
      if (
        user.subscription?.isActive && user.subscription.endDate &&user.subscription.endDate < new Date()
      ) {
        user.subscription.isActive = false;
        await user.save();
        return res.status(HttpStatus.FORBIDDEN).json({message: "Subscription expired. Please renew your plan.", });
      }
      next();
    } catch (err) {
      console.error("companyAuth error:", err);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  });
};   
  