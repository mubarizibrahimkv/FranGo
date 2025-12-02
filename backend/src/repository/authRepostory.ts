import { IAuthRepo } from "../interface/ṛepository/authRepositoryInterface";
import Investor, { IInvestor } from "../models/investorModel";
import { BaseRepository } from "./baseRepository";

export class AuthRepository extends BaseRepository<IInvestor> implements IAuthRepo {
    constructor() {
        super(Investor);
    }
    async registerUser(
        userName: string,
        email: string,
        hashedPassword: string,
        role: string,
        hashedOtp: string,
        otpExpires: number
    ) {
        const user = new Investor({
            userName,
            email,
            password: hashedPassword,
            role,
            otp: hashedOtp,
            otpExpires,
            isAdmin: false
        });
        return await user.save();
    }

    async findByEmail(email: string): Promise<IInvestor | null> {
        return Investor.findOne({ email });
    }


    async findById(id: string): Promise<IInvestor | null> {
        try {
            return await Investor.findById(id).populate("previousBusiness", "categoryName")
                .populate("preferredFranchiseType", "categoryName");    
        } catch (error) {
            console.error("Error in findById:", error);
            throw error;
        }
    }

    async saveUser(user: any) {
        return await user.save();
    }
}