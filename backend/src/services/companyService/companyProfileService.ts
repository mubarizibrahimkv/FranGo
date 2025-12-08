import mongoose from "mongoose";
import { IError } from "../../interface/service/authInterface";
import IcompanyService from "../../interface/service/companyProfileInterface";
import { ICompanyProfileRepo } from "../../interface/ṛepository/companyProfileRepositoryInterface";
import Company, { ICompany } from "../../models/companyModel";
import IndustryCategory, { IIndustryCategory } from "../../models/industryCategoryModel";
import { CompanySerivceResponse } from "../../types/interfaceTypes";
import bcrypt from "bcrypt";
import { IFranchise } from "../../models/franchiseModel";
import { IFranchiseRepo } from "../../interface/ṛepository/franchiseRepoInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { Messages } from "../../constants/messages";
import { IApplicationRepo } from "../../interface/ṛepository/applicationRepoInterface";
import crypto from "crypto";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";

export class CommpanyProfileService implements IcompanyService {

    constructor(private _companyProfileRepo: ICompanyProfileRepo, private _franchiseRepo: IFranchiseRepo, private _applicationRepo: IApplicationRepo, private _notificationRepo: INotificationRepo) { }

    getProfiles = async (companyId: string): Promise<CompanySerivceResponse> => {
        try {
            const company = await this._companyProfileRepo.findById(companyId);
            if (!company) {
                return {
                    company: {} as ICompany,
                    message: Messages.COMPANY_NOT_FOUND,
                };
            }
            return {
                company: company,
                message: Messages.FETCH_SUCCESS,
            };
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };



    updateLogo = async (companyLogo: string, companyId: string) => {
        try {
            const company = await Company.findById(companyId);
            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
            }
            company.companyLogo = companyLogo;
            await company.save();
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    updateProfile = async (companyData: ICompany, companyId: string) => {
        try {
            const industryCategory = await IndustryCategory.findById(companyData.industryCategory);
            if (!industryCategory) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.INDUSTRY_CATEGORY_NOT_FOUND };
            }
            if (typeof companyData.industryCategory === "string") {
                companyData.industryCategory = new mongoose.Types.ObjectId(companyData.industryCategory);
            }
            const updated = await this._companyProfileRepo.updateProfile(companyData, companyId);
            if (!updated) throw new Error(Messages.UPDATE_FAILED);
            const adminId = "$2b$10$fRCoV5J/OXDVA2wGEPLPL.NLeAlt8wnUpyKygCDC31K5B4xfGh.em";
            await this._notificationRepo.create({
                userId: new mongoose.Types.ObjectId(adminId),
                message: "A company has completed its profile. Please review and verify.",
                isRead: false,
            });

            return updated;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    reapply = async (companyId: string) => {
        try {
            const company = await this._companyProfileRepo.findById(companyId);
            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
            }
            company.status = "pending";
            company.save();
            return;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
        const user = await this._companyProfileRepo.findById(userId);
        if (!user) {
            throw new Error(Messages.COMPANY_NOT_FOUND);
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

    getFranchises = async (companyId: string, page: number) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const company = await Company.findById(companyId)
                .populate<{ industryCategory: IIndustryCategory }>("industryCategory")
                .lean();

            if (!company) {
                throw new Error(Messages.COMPANY_NOT_FOUND);
            }

            if (!company.industryCategory) {
                throw new Error(Messages.INDUSTRY_CATEGORY_NOT_FOUND);
            }

            const companyIndustryCategory = company.industryCategory;
            const [franchises, totalFranchise] = await Promise.all([
                this._franchiseRepo.findByCompanyId(companyId, skip, limit),
                this._franchiseRepo.countByCompanyId(companyId),
            ]);
            const totalPages = Math.ceil(totalFranchise / limit);


            return { companyIndustryCategory, franchises, totalPages };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching company industry category:", error.message);
            } else {
                console.error("Unknown error while fetching company industry category");
            }
            throw new Error("Failed to fetch industry category");
        }
    };

    addFranchise = async (companyId: string, data: IFranchise) => {
        try {
            const company = await this._companyProfileRepo.findById(companyId);
            if (!company) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND } as IError;
            }

            const franchiseData = {
                ...data,
                company: new mongoose.Types.ObjectId(companyId),
            };
            let totalInvestement;
            if (data.franchisefee && data.advertisingfee) {
                totalInvestement = Number(data.franchisefee) + Number(data.advertisingfee);
            }

            franchiseData.totalInvestement = totalInvestement;

            const franchise = await this._franchiseRepo.create(franchiseData);

            if (!franchise) {
                throw new Error(Messages.CREATE_FAILED);
            }

            return franchise;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error creating franchise:", error.message);
            } else {
                console.error("Unknown error while creating franchise");
            }
            throw new Error(Messages.CREATE_FAILED);
        }
    };

    editFranchise = async (franchiseId: string, data: IFranchise) => {
        try {
            const franchise = await this._franchiseRepo.findById(franchiseId);
            if (!franchise) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.FRANCHISE_NOT_FOUND } as IError;
            }

            let totalInvestement;
            if (data.franchisefee && data.advertisingfee) {
                totalInvestement = Number(data.franchisefee) + Number(data.advertisingfee);
            }

            data.totalInvestement = totalInvestement;

            const updated = await this._franchiseRepo.update(franchiseId, data);
            if (!updated) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.UPDATE_FAILED } as IError;
            }

            return updated;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error editing franchise:", error.message);
            } else {
                console.error("Unknown error while editing franchise");
            }
            throw new Error("Failed to edit franchise");
        }
    };

    deleteFranchise = async (franchiseId: string) => {
        try {
            const deleted = await this._franchiseRepo.delete(franchiseId);
            if (!deleted) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.DELETE_FAILED } as IError;
            }
            return deleted;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error deleting franchise:", error.message);
            } else {
                console.error("Unknown error while deleting franchise");
            }
            throw new Error("Failed to delete franchise");
        }
    };

    franchiseDetails = async (franchiseId: string) => {
        try {
            const franchise = await this._franchiseRepo.findById(franchiseId);
            if (!franchise) {
                throw { status: HttpStatus.BAD_REQUEST, message: Messages.FRANCHISE_NOT_FOUND } as IError;
            }
            return franchise;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching franchise details:", error.message);
            } else {
                console.error("Unknown error while fetching franchise details");
            }
            throw new Error("Failed to fetch franchise details");
        }
    };
    getApplications = async (companyId: string, page: number) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const company = this._companyProfileRepo.findById(companyId);
            if (!company) {
                throw new Error(Messages.COMPANY_NOT_FOUND);
            }
            const application = await this._applicationRepo.findByCompanyId(companyId, skip, limit);
            const totalApplications = await this._applicationRepo.countByCompanyId(companyId);
            const totalPages = Math.ceil(totalApplications / limit);
            return { application, totalPages };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching franchise details:", error.message);
            } else {
                console.error("Unknown error while fetching franchise details");
            }
            throw new Error("Failed to fetch franchise details");
        }
    };
    changeApplicationStatus = async (applicationId: string, status: "approved" | "rejected" | "pending") => {
        try {
            const application = await this._applicationRepo.findById(applicationId);
            if (!application) {
                throw new Error(Messages.APPLICATION_NOT_FOUND);
            }
            application.status = status;
            await application.save();
            const message = status === "approved" ? "Your application has been approved by the company." : "Your application has been rejected by the company.";
            await this._notificationRepo.create({
                userId: application.investor,
                message,
                isRead: false,
            });
            return application;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching franchise details:", error.message);
            } else {
                console.error("Unknown error while fetching franchise details");
            }
            throw new Error("Failed to fetch franchise details");
        }
    };
    verifyPayment = async (
        companyId: string,
        razorpayPaymentId: string,
        razorpayOrderId: string,
        razorpaySignature: string,
        amount: string
    ) => {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (generatedSignature !== razorpaySignature) {
            console.error("Expected:", generatedSignature, "Got:", razorpaySignature);
            throw new Error("Invalid payment signature");
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(startDate.getFullYear() + 1);

        await Company.findByIdAndUpdate(companyId, {
            $set: {
                "subscription.isActive": true,
                "subscription.startDate": startDate,
                "subscription.endDate": endDate,
            },
        });

        return { message: "Subscription activated successfully" };
    };
    getNotification = async (userId: string) => {
        try {
            const notifications = await this._notificationRepo.findByUserId(userId);
            return notifications || [];
        } catch (error) {
            throw error;
        }
    };
    updateNotification = async (notificationId: string) => {
        try {
            const notification = await this._notificationRepo.updateIsRead(notificationId);
            if (!notification) {
                throw ({ success: false, message: Messages.NOTIFICATION_NOT_FOUND });
            }
            return notification;
        } catch (error) {
            throw error;
        }
    };
}  