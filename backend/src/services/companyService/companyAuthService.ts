import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import { formData } from "../../controllers/company/authController";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { IError } from "../../interface/service/authInterface";
import { ICompanyAuthService } from "../../interface/service/companyAuthInterface";
import { ICompanyAuthRepo } from "../../interface/ṛepository/companyAuthRepositoryInterface";
import logger from "../../logger";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";
dotenv.config();  

export class CompanyAuthService implements ICompanyAuthService {
    constructor(private _authRepo: ICompanyAuthRepo) { }
    register = async (formData: formData, registrationProof: string, companyLogo: string) => {
        try {
            const existUser = await this._authRepo.findByEmail(formData.email);
            if (existUser) throw { status: HttpStatus.BAD_REQUEST, message: Messages.ALREADY_EXISTS } as IError;
            const hashedPassword = await bcrypt.hash(formData.password, 10);

            const verificationToken = crypto.randomBytes(32).toString("hex");

            const company = await this._authRepo.registerUser(formData.companyName, formData.email, formData.role, registrationProof, companyLogo, hashedPassword, verificationToken);
 
            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
            }
            await this.sendVerificationEmail(formData.email, verificationToken, "");

            const token = generateToken(String(company._id), "company");
            const refreshToken = generateRefreshToken(String(company._id), "company");
            
            return { company, token, refreshToken };
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    verifyCompany = async (verificationToken: string) => {
        try {
            const company = await this._authRepo.findByVerificationToken(verificationToken);

            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message:Messages.PASSWORD_DO_NOT_MATCH} as IError;
            }

            if (!company.isVerified) {
                company.isVerified = true;
                company.verificationToken = null;
                await company.save();
            }

            return { user: company };

        } catch (error) {
            console.error("Verify company error:", error);
            throw error;
        }
    };


    sendVerificationEmail = async (email: string, verificationToken: string, purpose: string) => {
        try {

            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD,
                }
            });

            const verificationUrl = `${process.env.CLIENT_URL}/company/verifyEmail?token=${verificationToken}&purpose=${purpose}`;

            console.log("🔗 Verification link:", verificationUrl);

            const info = await transporter.sendMail({
                from: `"FranGo " <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject: "Verify your FranGo account",
                html: `y
                    <h2>Welcome to FranGo!</h2>
                    <p>Please verify your email to complete registration.</p>
                    <a href="${verificationUrl}  rel="noopener noreferrer"" 
                        style="display:inline-block;padding:10px 20px;
                               background:#1F3C58;color:white;
                               text-decoration:none;border-radius:5px;">
                        Verify Email
                    </a>
                    <p>If you didn’t request this, you can ignore this email.</p>
                `
            });

            logger.info("Verification email sent:");

            return info.accepted.length > 0;
        } catch (error) {
            console.error("Error sending email", error);
            return false;
        }
    };

    resendLink = async (email: string, purpose: string) => {
        try {
            const company = await this._authRepo.findByEmail(email);
            if (!company) throw { status: HttpStatus.BAD_REQUEST, message:  Messages.COMPANY_NOT_FOUND } as IError;
            const verificationToken = crypto.randomBytes(32).toString("hex");
            await this.sendVerificationEmail(email, verificationToken, purpose);
            company.verificationToken = verificationToken;
            await company.save();
            return company;
        } catch (error) {
            console.error("Resend Link Error:", error);
            throw error;
        }
    };
    forgotPassword = async (email: string) => {
        try {
            const company = await this._authRepo.findByEmail(email);
            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
            }
            const verificationToken = crypto.randomBytes(32).toString("hex");
            await this.sendVerificationEmail(email, verificationToken, "forgotPassword");
            company.verificationToken = verificationToken;
            return await this._authRepo.saveUser(company);
        } catch (error) {
            console.error("Forgot password Error:", error);
            throw error;
        }
    };


    async login(email: string, password: string) {

        const company = await this._authRepo.findByEmail(email);

        if (!company) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
        }

        if(company.isBlocked){
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.ACCOUNT_BLOCKED } as IError;
        }
        if (!company.password) {
            throw { status: HttpStatus.BAD_REQUEST, message: "Password is missing for this user" } as IError;
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.PASSWORD_DO_NOT_MATCH } as IError;
        }
        const id = typeof company._id === "string" ? company._id : String(company._id);
        const token = generateToken(id, "company");
        const refreshToken = generateRefreshToken(id, "company");

        return {
            company,
            token,
            refreshToken,
        };
    }

    
    changePassword = async (email: string, password: string) => {
        try {
          const investor = await this._authRepo.findByEmail(email);
    
          if (!investor) {
            throw { status: HttpStatus.NOT_FOUND, message:  Messages.COMPANY_NOT_FOUND } as IError;
          }
    
          const hashedPassword = await bcrypt.hash(password, 10);
    
          investor.password = hashedPassword;
            await this._authRepo.saveUser(investor);
    
          return investor;
        } catch (error) {
            console.error("Forgot password Error:", error);
          throw error;
        }
      };
}