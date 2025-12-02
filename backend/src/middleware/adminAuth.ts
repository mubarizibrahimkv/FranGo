import { AuthenticatedRequest, verifyToken } from "./authMiddleware";
import Company from "../models/companyModel";
import Investor from "../models/investorModel";
import Customer from "../models/customerModel";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../utils/httpStatusCode";

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;

  await verifyToken(authReq, res, async () => {
    try {
      if (!authReq.user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });

      const { id, role } = authReq.user;
      let user;

      switch (role) {
        case "company":
          user = await Company.findById(id);
          break;
        case "investor":
          user = await Investor.findById(id);
          break;
        case "customer":
          user = await Customer.findById(id);
          break;
        default:
          return res.status(HttpStatus.FORBIDDEN).json({ message: "Invalid role" });
      }

      if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User not found" });
      if (!user.isAdmin) return res.status(HttpStatus.FORBIDDEN).json({ message: "Access denied" });
      if (user.isBlocked) return res.status(HttpStatus.FORBIDDEN).json({ message: "Account blocked" });

      next(); 
    } catch (error) {
      console.error("adminAuth error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  });
};
