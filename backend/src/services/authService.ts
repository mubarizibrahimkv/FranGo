import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken, JwtPayload, verifyRefreshToken } from "../utils/jwt";
import { IInvestor } from "../models/investorModel";
import { IAuthService, IError } from "../interface/service/authInterface";
import { IAuthRepo } from "../interface/ṛepository/authRepositoryInterface";
import { sendVerificationEmail } from "../utils/mailService";
import HttpStatus from "../utils/httpStatusCode";
import { Messages } from "../constants/messages";
import { InvestorMapper } from "../mappers/investor.mapper";

export class AuthService implements IAuthService {
  constructor(private _authRepo: IAuthRepo) { }

  async registerUser(userName: string, email: string, password: string, role: string) {
    try {
      const existInvestor = await this._authRepo.findByEmail(email);

      if (existInvestor)
        throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND } as IError;

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      sendVerificationEmail(email, otp);
      console.log("otp :", otp);
      const hashedOtp = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 5 * 60 * 1000;

      const user = await this._authRepo.registerUser(userName, email, hashedPassword, role, hashedOtp, otpExpires);

      if (!user) throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "User registration failed" } as IError;

      const id = String(user._id);
      const token = generateToken(id, user.role);
      const refreshToken = generateRefreshToken(id, user.role);

      return { user:InvestorMapper.toResponse(user), token, refreshToken };
    } catch (error) {
      console.log("Error in register", error);
      throw error;
    }
  }


  async verifyOtp(email: string, otp: string) {
    const investor = await this._authRepo.findByEmail(email);

    if (!investor) {
      throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND } as IError;
    }


    if (!investor.otp || !investor.otpExpires || Date.now() > investor.otpExpires) {
      throw { status: HttpStatus.BAD_REQUEST, message: "OTP expired or invalid" } as IError;
    }

    const isMatch = await bcrypt.compare(otp.trim(), investor.otp);
    if (!isMatch) {
      throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_OTP} as IError;
    }

    investor.otp = null;
    investor.otpExpires = null;

    await this._authRepo.saveUser(investor);
    return {
      investor:InvestorMapper.toResponse(investor),
      message: "OTP verified successfully",
    };
  }



  async resendOtp(email: string): Promise<string> {
    const investor = await this._authRepo.findByEmail(email);

    if (!investor) {
      throw { status: HttpStatus.NOT_FOUND, message: Messages.INVESTOR_NOT_FOUND } as IError;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(newOtp, 10);
    const otpExpires = Date.now() + 2 * 60 * 1000;

    investor.otp = hashedOtp;
    investor.otpExpires = otpExpires;
    await this._authRepo.saveUser(investor);
    sendVerificationEmail(email, newOtp);
    console.log(`New OTP for ${email}: ${newOtp}`);
    return "OTP resent successfully";
  }


  async Login(email: string, password: string) {

    const user = await this._authRepo.findByEmail(email);

    if (!user) {
      throw { status: HttpStatus.NOT_FOUND, message:Messages.INVESTOR_NOT_FOUND } as IError;
    }

    if (user.isBlocked) {
      throw { status: HttpStatus.NOT_FOUND, message: Messages.ACCOUNT_BLOCKED } as IError;
    }
    if (!user.password) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Password is missing for this user" } as IError;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: HttpStatus.BAD_REQUEST, message:Messages.PASSWORD_DO_NOT_MATCH } as IError;
    }

    const id = typeof user._id === "string" ? user._id : String(user._id);
    const token = generateToken(id, user.role);
    const refreshToken = generateRefreshToken(id, user.role);

    return {
      user:InvestorMapper.toResponse(user),
      token,
      refreshToken,
    };
  }


  async refreshToken(refreshToken: string) {
  if (!refreshToken) throw new Error(Messages.NO_REFRESH_TOKEN);

  const decoded = verifyRefreshToken(refreshToken) as JwtPayload; 
  const newAccessToken = generateToken(decoded.id, decoded.role);

  return newAccessToken;
}

  forgotPassword = async (email: string) => {
    try {
      const investor: IInvestor | null = await this._authRepo.findByEmail(email);

      if (!investor) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.INVESTOR_NOT_FOUND } as IError;
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("otp :", otp);
      const hashedOtp = await bcrypt.hash(otp, 10);
      const otpExpires = Date.now() + 5 * 60 * 1000;
      investor.otp = hashedOtp;
      investor.otpExpires = otpExpires;

      await this._authRepo.saveUser(investor as IInvestor);

      return investor;
    } catch (error) {
      console.log("Error in forgot password", error);
      throw error;
    }
  };

  changePassword = async (email: string, password: string) => {
    try {
      const investor: IInvestor | null = await this._authRepo.findByEmail(email);

      if (!investor) {
        throw { status: HttpStatus.NOT_FOUND, message: Messages.INVESTOR_NOT_FOUND } as IError;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      investor.password = hashedPassword;
      await this._authRepo.saveUser(investor as IInvestor);

      return investor;
    } catch (error) {
      console.log("Error in change password", error);
      throw error;
    }
  };
}
