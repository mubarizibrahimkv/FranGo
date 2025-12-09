import { Request, Response } from "express";
import { IAuthService } from "..//interface/service/authInterface";
import { IAuthController } from "../interface/controller/investor/authControllerInterface";
import { generateRefreshToken, generateToken } from "../utils/jwt";
const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
import dotenv from "dotenv";
import HttpStatus from "../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { Messages } from "../constants/messages";
import { AuthenticatedUser } from "../config/passport";
dotenv.config();


export class AuthController implements IAuthController {

  constructor(private _authService: IAuthService) { }

  register = async (req: Request, res: Response) => {
    const { userName, email, password, role } = req.body;
    try {
      const { user, token, refreshToken } = await this._authService.registerUser(userName, email, password, role);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge
      });

      res.status(HttpStatus.OK).json(user);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };


  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { user, token, refreshToken } = await this._authService.Login(email, password);
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: refreshTokenMaxAge
      });
      res.status(HttpStatus.OK).json(user);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };


  refresh = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "No refresh token found" });
        return;
      }

      const newAccessToken = await this._authService.refreshToken(refreshToken);

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: accessTokenMaxAge,
      });

      res.status(HttpStatus.OK).json({ accessToken: newAccessToken });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }

  };



  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    try {

      const { investor, message } = await this._authService.verifyOtp(email, otp);

      res.status(HttpStatus.OK).json({
        message,
        user: {
          _id: investor._id,
          email: investor.email,
          userName: investor.userName,
          role: investor.role,
          isAdmin: investor.isAdmin
        },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }

  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const message = await this._authService.resendOtp(email);
      res.status(HttpStatus.OK).json({ message });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };


  logoutUser = async (req: Request, res: Response) => {
    const id = req.params;
    try {
      if (!id) {
        res.status(HttpStatus.OK).json({ message: "User ID is required" });
        return;
      }
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      res.status(HttpStatus.OK).json({ message: Messages.LOGOUT_SUCCESS });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  forgetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const investor = await this._authService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY, investor });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  changePassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const investor = await this._authService.changePassword(email, password);
      res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY, investor });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };


  googleCallBack = async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: Messages.UNAUTHORIZED_ACCESS });
      return;
    }

    const user = req.user as AuthenticatedUser;
    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

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
    res.redirect(`${process.env.CLIENT_URL}`);
  };
  getGoogleUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED_ACCESS });
        return;
      }

      const user = req.user as AuthenticatedUser;
      res.json({
        _id: user.id,
        userName: user.companyName || user.userName,
        profileImage: user.profileImage,
        email: user.email,
        isAdmin: user.isAdmin || false,
        role: user.role,
        token: req.cookies.access_token || null,
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };

      res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message ?? ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };
}

