import bcrypt from "bcrypt";
import { ICustomerAuthService } from "../../interface/service/customerAuthService";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import { ICustomerAuthRepo } from "../../interface/ṛepository/customerAuthRepoInterface";
import { sendVerificationEmail } from "../../utils/mailService";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";

export class CustomerAuthService implements ICustomerAuthService {
    constructor(private _authRepo: ICustomerAuthRepo) { }

    async registerUser(userName: string, email: string, password: string, role: string) {
        try {
            const existCustomer = await this._authRepo.findByEmail(email);

            if (existCustomer)
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.ALREADY_EXISTS };

            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            sendVerificationEmail(email, otp);
            console.log("otp :", otp);
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpExpires = Date.now() + 5 * 60 * 1000;

            const user = await this._authRepo.registerCustomer(userName, email, hashedPassword, role, hashedOtp, otpExpires);

            if (!user) throw { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "User registration failed" };

            const id = String(user._id);
            const token = generateToken(id, user.role);
            const refreshToken = generateRefreshToken(id, user.role);

            return { user, token, refreshToken };
        } catch (error) {
            console.log("Error in register customer ", error);
            throw error;
        }
    }


    async verifyOtp(email: string, otp: string) {
        const customer = await this._authRepo.findByEmail(email);

        if (!customer) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.USER_NOT_FOUND };
        }


        if (!customer.otp || !customer.otpExpires || Date.now() > customer.otpExpires) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_OTP };
        }

        const isMatch = await bcrypt.compare(otp.trim(), customer.otp);
        if (!isMatch) {
            throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_OTP };
        }

        customer.otp = null;
        customer.otpExpires = null;

        await this._authRepo.saveUser(customer);
        return {
            customer,
            message: "OTP verified successfully",
        };
    }



    async resendOtp(email: string): Promise<string> {
        const customer = await this._authRepo.findByEmail(email);

        if (!customer) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(newOtp, 10);
        const otpExpires = Date.now() + 2 * 60 * 1000;

        customer.otp = hashedOtp;
        customer.otpExpires = otpExpires;
        await this._authRepo.saveUser(customer);

        sendVerificationEmail(email, newOtp);
        console.log(`New OTP for ${email}: ${newOtp}`);
        return "OTP resent successfully";
    }



    async Login(email: string, password: string) {

        const user = await this._authRepo.findByEmail(email);

        if (!user) {
            throw { status: HttpStatus.NOT_FOUND, message:Messages.USER_NOT_FOUND };
        }

        if (user.isBlocked) {
            throw { status: HttpStatus.NOT_FOUND, message: Messages.ACCOUNT_BLOCKED };
        }

        if (!user.password) {
            throw { status: HttpStatus.BAD_REQUEST, message: "Password is missing for this user" };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: HttpStatus.UNAUTHORIZED, message: Messages.PASSWORD_DO_NOT_MATCH };
        }

        const id = typeof user._id === "string" ? user._id : String(user._id);
        const token = generateToken(id, user.role);
        const refreshToken = generateRefreshToken(id, user.role);

        return {
            user,
            token,
            refreshToken,
        };
    }

    forgotPassword = async (email: string) => {
        try {
            const customer = await this._authRepo.findByEmail(email);

            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("otp :", otp);
            const hashedOtp = await bcrypt.hash(otp, 10);
            const otpExpires = Date.now() + 5 * 60 * 1000;
            customer.otp = hashedOtp;
            customer.otpExpires = otpExpires;

            await this._authRepo.saveUser(customer);

            return customer;
        } catch (error) {
            console.log("Error in customer forgot password", error);
            throw error;
        }
    };

    changePassword = async (email: string, password: string) => {
        try {
            const customer = await this._authRepo.findByEmail(email);

            if (!customer) {
                throw { status: HttpStatus.NOT_FOUND, message: Messages.USER_NOT_FOUND };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            customer.password = hashedPassword;
            await this._authRepo.saveUser(customer);

            return customer;
        } catch (error) {
            console.log("Error in customer change password", error);
            throw error;
        }
    };
}
