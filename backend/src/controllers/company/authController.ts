import { Request, Response } from "express";
import { ICompanyAuthService } from "../../interface/service/companyAuthInterface";
import { ICompanyAuthController } from "../../interface/controller/company/companyAuthInterface";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
const accessTokenMaxAge = Number(process.env.ACCESS_TOKEN_MAX_AGE) || 6 * 60 * 60 * 1000;
const refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000;
import dotenv from "dotenv";
dotenv.config();
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";

export interface formData {
  companyName: string;
  password: string;
  email: string;
  role: "customer" | "admin" | "investor" | "company";
  registrationProof: string;
  companyLog: string;
}

export class CompanyAuthController implements ICompanyAuthController {
  constructor(private _companyAuthSerice: ICompanyAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const formData: formData = req.body;
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const registrationProofFile = files["registrationProof"]?.[0];
      const companyLogoFile = files["companyLogo"]?.[0];

      if (!registrationProofFile || !companyLogoFile) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_FIELDS });
        return;
      }

      const { company, token, refreshToken } =
        await this._companyAuthSerice.register(
          formData,
          registrationProofFile.path,
          companyLogoFile.path
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

      res.status(HttpStatus.CREATED).json({
        success: true,
        message:Messages.REGISTER_SUCCESS,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR});
      }
    }
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const { company, token, refreshToken } = await this._companyAuthSerice.login(email, password);
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
      res.status(HttpStatus.OK).json(company);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;
    try {
      if (!token || typeof token !== "string") {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_TOKEN});
        return;
      }

      const company = await this._companyAuthSerice.verifyCompany(token);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Email verified successfully!",
        company,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_TOKEN });
      }
    }
  };

  resendLink = async (req: Request, res: Response) => {
    const { email, purpose } = req.body;
    try {
      const company = await this._companyAuthSerice.resendLink(email, purpose);
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Link sent successfully!",
        company,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: Messages.INVALID_TOKEN });
      }
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const company = await this._companyAuthSerice.forgotPassword(email);
      res.status(HttpStatus.OK).json({ success: true, message: "Successfully Completed", company });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  };

  changePassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const investor = await this._companyAuthSerice.changePassword(email, password);
      res.status(HttpStatus.OK).json({ success: true, message: "Successfully Completed", investor });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  };

  googleCallBack = async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(HttpStatus.NOT_FOUND).json({ message: Messages.AUTHENTICATION_FAILED });
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

    res.redirect(`${process.env.CLIENT_URL}/company/dashboard`);
  };

  getGoogleUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.AUTHENTICATION_FAILED });
        return;
      }

      const user = req.user as any;
      res.json({
        _id: user.id,
        userName: user.companyName || user.userName,
        profileImage: user.profileImage,
        email: user.email,
        isAdmin: user.isAdmin || false,
        role: user.role,
        status:user.status,
        token: req.cookies.access_token || null,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
      }
    }
  };
}
