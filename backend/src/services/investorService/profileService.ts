import Investor, { IInvestor } from "../../models/investorModel";
import { IError } from "../../interface/service/authInterface";
import { IProfileService } from "../../interface/service/profileInterface";
import { IAuthRepo } from "../../interface/ṛepository/authRepositoryInterface";
import { IProfileRepo } from "../../interface/ṛepository/profileRepoInterface";
import bcrypt from "bcrypt";
import { IIndustryCategoryRepo } from "../../interface/ṛepository/adminIndustryCategoryInterface";
import mongoose, { Types } from "mongoose";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";

interface ICategory {
  categoryName: string;
}

export class ProfileService implements IProfileService {
    constructor(private _authRepo: IAuthRepo, private _profileRepo: IProfileRepo, private _industryCategoryRepo: IIndustryCategoryRepo, private _notificationRepo: INotificationRepo) { }
    getProfile = async (investorId: string) => {
        try {
            const seeker = await this._authRepo.findById(investorId);
            const industryCategory = await this._industryCategoryRepo.findAll();
            if (!seeker) {
                throw {
                    status: HttpStatus.BAD_REQUEST,
                    message: Messages.INVESTOR_NOT_FOUND,
                } as IError;
            }
            const seekerObj = seeker.toObject();

            seekerObj.previousBusiness = seekerObj.previousBusiness?.map(
                (cat: ICategory) => cat.categoryName
            );
            seekerObj.preferredFranchiseType = seekerObj.preferredFranchiseType?.map(
                (cat: ICategory) => cat.categoryName
            );
            return { seeker: seekerObj, industryCategory };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    updateProfileImage = async (investorId: string, imageUrl: string) => {
        try {
            const seeker = await Investor.findById(investorId);
            if (!seeker) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND } as IError;
            }
            seeker.profileImage = imageUrl;
            await seeker.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    updateProfile = async (investorId: string, updatedData: IInvestor) => {
        try {
            if (updatedData.previousBusiness?.length) {
                updatedData.previousBusiness = updatedData.previousBusiness.map(
                    (id) => new Types.ObjectId(id)
                );
            }

            if (updatedData.preferredFranchiseType?.length) {
                updatedData.preferredFranchiseType = updatedData.preferredFranchiseType.map(
                    (id) => new Types.ObjectId(id)
                );
            }
            const investor = await this._profileRepo.updateProfile(investorId, updatedData);
            if (!investor) throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND };
            const adminId = "$2b$10$fRCoV5J/OXDVA2wGEPLPL.NLeAlt8wnUpyKygCDC31K5B4xfGh.em";
            await this._notificationRepo.create({
                userId: new mongoose.Types.ObjectId(adminId),
                message: "A investor has completed its profile. Please review and verify.",
                isRead: false,
            });

            return investor;
        } catch (error) {
            console.error("Error updating investor profile:", error);
            throw error;
        }
    };

    reapply = async (investorId: string) => {
        try {
            const investor = await this._profileRepo.findById(investorId);
            if (!investor) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND } as IError;
            }
            investor.status = "pending";
            investor.save();
            return;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
        const user = await this._authRepo.findById(userId);
        if (!user) {
            throw new Error(Messages.INVESTOR_NOT_FOUND);
        }
        if (!user.password) {
            throw new Error("User password not found");
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new Error("Current password is incorrect");
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new Error("New password cannot be same as current password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return true;
    };

}
