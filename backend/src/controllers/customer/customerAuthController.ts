import { Request, Response } from "express";
import { ICustomerAuthController } from "../../interface/controller/customer/customerAuthControllerInterface";
import { ICustomerAuthService } from "../../interface/service/customerAuthService";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import dotenv from "dotenv";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";

dotenv.config();

const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;

export class CustomerAuthController implements ICustomerAuthController {
  constructor(private _customerAuthService: ICustomerAuthService) {}

  register = async (req: Request, res: Response) => {
    const { userName, email, password, role } = req.body;
    try {
      const { user, token, refreshToken } = await this._customerAuthService.registerUser(
        userName,
        email,
        password,
        role
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { user, token, refreshToken } = await this._customerAuthService.Login(email, password);

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message :ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {
      const { customer, message } = await this._customerAuthService.verifyOtp(email, otp);
      res.status(HttpStatus.OK).json({
        message,
        user: {
          _id: customer._id,
          email: customer.email,
          userName: customer.userName,
          role: customer.role,
          isAdmin: customer.isAdmin,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const message = await this._customerAuthService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message :ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  logoutUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "User ID is required" });
        return;
      }

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(HttpStatus.OK).json({ message: Messages.LOGOUT_SUCCESS });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : Messages.LOGOUT_FAILED;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const customer = await this._customerAuthService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ success: true, message: "Successfully Completed", customer });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const customer = await this._customerAuthService.changePassword(email, password);
      res.status(HttpStatus.OK).json({ success: true, message: "Successfully Completed", customer });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      const status = (error as any)?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({ message });
    }
  };

  googleCallBack = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(HttpStatus.NOT_FOUND).json({ message: Messages.UNAUTHORIZED_ACCESS  });
        return;
      }

      const user = req.user as any;
      const accessToken = generateToken(user.id, user.isAdmin);
      const refreshToken = generateRefreshToken(user.id, user.isAdmin);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge,
      });

      res.redirect(`${process.env.CLIENT_URL}/customer`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  getGoogleUser = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message:Messages.UNAUTHORIZED_ACCESS });
        return;
      }

      const user = req.user as any;
      res.status(HttpStatus.OK).json({
        _id: user.id,
        userName: user.companyName || user.userName,
        profileImage: user.profileImage,
        email: user.email,
        isAdmin: user.isAdmin || false,
        role: user.role,
        token: req.cookies.access_token || null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };
}
