import { Request, Response, NextFunction } from "express";
import Investor from "../models/investorModel";
import { verifyToken, AuthenticatedRequest } from "./authMiddleware";
import HttpStatus from "../utils/httpStatusCode";

export const investorAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;

  await verifyToken(authReq, res, async () => {
    try {
      if (!authReq.user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });

      const user = await Investor.findById(authReq.user.id);
      if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Investor not found, please login again" });
      if (user.isBlocked)
        return res.status(HttpStatus.FORBIDDEN).json({ message: "Your investor account is blocked" });

      next();
    } catch (error) {
      console.error("investorAuth error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  });
};
