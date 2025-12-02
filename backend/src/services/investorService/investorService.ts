import mongoose, { ObjectId, Types } from "mongoose";
import { Messages } from "../../constants/messages";
import { IInvestorService } from "../../interface/service/investorServiceInterface";
import { IFranchiseRepo } from "../../interface/ṛepository/franchiseRepoInterface";
import { IFilters } from "../../types/addressInput";
import HttpStatus from "../../utils/httpStatusCode";
import Franchise from "../../models/franchiseModel";
import { IInvestor } from "../../models/investorModel";
import { IProfileRepo } from "../../interface/ṛepository/profileRepoInterface";
import { IApplicationRepo } from "../../interface/ṛepository/applicationRepoInterface";
import { IApplication } from "../../models/applicationModel";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Payment, { IPayment } from "../../models/paymentModel";
import crypto from "crypto";
import { IRepoortRepo } from "../../interface/ṛepository/reportRepoInterface";
import { IReport } from "../../models/reportModel";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";
dotenv.config();


export class InvestorService implements IInvestorService {
    constructor(private _FranchiseRepo: IFranchiseRepo, private _profileRepo: IProfileRepo, private _applicationRepo: IApplicationRepo, private _reportRepo: IRepoortRepo, private _notificationRepo: INotificationRepo) { }

    getFranchises = async (filters: IFilters, page: number) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const match: any = {};

            if (filters.location) {
                const locations = filters.location.split(",").map((loc) => loc.trim());
                match.$or = locations.map((loc) => ({
                    preferedLocation: { $regex: new RegExp(`^${loc}`, "i") },
                }));
            }

            if (filters.ownership) {
                match.ownershipModel = { $in: filters.ownership.split(",") };
            }

            if (filters.minFee || filters.maxFee) {
                match.totalInvestement = {};
                if (filters.minFee) match.totalInvestement.$gte = Number(filters.minFee);
                if (filters.maxFee) match.totalInvestement.$lte = Number(filters.maxFee);
            }

            const sortOption: Record<string, 1 | -1> = {};
            if (filters.sort) {
                const order = filters.order === "desc" ? -1 : 1;
                switch (filters.sort) {
                    case "date":
                        sortOption.createdAt = order;
                        break;
                    case "revenue":
                        sortOption.monthlyRevenue = order;
                        break;
                    case "investment":
                        sortOption.totalInvestement = order;
                        break;
                }
            }

            const pipeline: any[] = [
                { $match: match },
                {
                    $lookup: {
                        from: "companies",
                        localField: "company",
                        foreignField: "_id",
                        as: "company",
                    },
                },
                { $unwind: "$company" },
            ];

            if (filters.category) {
                const categoryIds = filters.category
                    .split(",")
                    .map((id) => new mongoose.Types.ObjectId(id.trim()));
                pipeline.push({
                    $match: { "company.industryCategory": { $in: categoryIds } },
                });
            }


            if (filters.search) {
                const regex = new RegExp(filters.search, "i");
                match.$or = [
                    { franchiseName: { $regex: regex } },
                    { "company.companyName": { $regex: regex } },
                ];
            }


            pipeline.push(
                {
                    $lookup: {
                        from: "industrycategories",
                        localField: "company.industryCategory",
                        foreignField: "_id",
                        as: "company.industryCategory",
                    },
                },
                {
                    $unwind: {
                        path: "$company.industryCategory",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                { $sort: sortOption },
                {
                    $project: {
                        _id: 1,
                        franchiseName: 1,
                        preferedLocation: 1,
                        ownershipModel: 1,
                        totalInvestement: 1,
                        monthlyRevenue: 1,
                        franchisefee: 1,
                        createdAt: 1,
                        "company.companyName": 1,
                        "company.companyLogo": 1,
                        "company.industryCategory.categoryName": 1,
                    },
                }
            );

            const franchises = await Franchise.aggregate(pipeline).skip(skip).limit(limit)
            const countPipeline = [...pipeline, { $count: "total" }];
            const countResult = await Franchise.aggregate(countPipeline);
            const totalFranchises = countResult.length > 0 ? countResult[0].total : 0;

            const totalPages = Math.ceil(totalFranchises / limit);

            return { franchises, totalPages, totalFranchises };
        } catch (error) {
            console.error("Error in getFranchises:", error);
            throw error;
        }
    };

    createApplication = async (formData: IInvestor, investorId: string, franchiseId: string) => {
        try {
            const investor = await this._profileRepo.updateProfile(investorId, formData)

            if (!investor) {
                throw {
                    status: HttpStatus.BAD_REQUEST, message: Messages.INVESTOR_NOT_FOUND
                };
            };
            if (investor.status === "pending") {
                throw { status: HttpStatus.BAD_REQUEST, message: "Your account is not verified yet." };
            }

            const franchise = await this._FranchiseRepo.findById(franchiseId)
            if (!franchise) {
                throw {
                    status: HttpStatus.BAD_REQUEST, message: Messages.FRANCHISE_NOT_FOUND
                };
            }
            const existingApp = await this._applicationRepo.findByInvestorAndFranchise(investorId, franchiseId);
            if (existingApp) {
                if (existingApp.status === "pending") {
                    throw { status: HttpStatus.BAD_REQUEST, message: "You’ve already applied. Please wait for approval." };
                } else if (existingApp.status === "approved") {
                    throw { status: HttpStatus.BAD_REQUEST, message: "Your application has already been approved!" };
                }
            }
            const application: Partial<IApplication> = {
                investor: new mongoose.Types.ObjectId(investorId),
                franchise: new mongoose.Types.ObjectId(franchiseId)
            };
            const apply = await this._applicationRepo.create(application)
            const companyId =
                franchise.company instanceof mongoose.Types.ObjectId
                    ? franchise.company
                    : franchise.company?._id
                        ? new mongoose.Types.ObjectId(franchise.company._id)
                        : null;

            if (!companyId) {
                throw new Error(Messages.COMPANY_NOT_FOUND);
            }
            await this._notificationRepo.create({
                userId: companyId,
                message: "An investor has submitted a new application. Please review it.",
                isRead: false,
            });
            return apply;
        } catch (error) {
            throw error;
        }
    };


    getFranchiseDetails = async (franchiseId: string) => {
        try {
            const franchise = await this._FranchiseRepo.findByIdWithComapny(franchiseId);
            if (!franchise) {
                throw {
                    status: HttpStatus.BAD_REQUEST, message: Messages.FRANCHISE_NOT_FOUND
                };
            }
            return franchise;
        } catch (error) {
            throw error;
        }
    };
    getApplications = async (investorId: string, page: number) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const application = await this._applicationRepo.findByInvestorId(investorId, skip, limit);
            const totalApplications = await this._applicationRepo.countByInvestorId(investorId)
            if (!application) {
                throw {
                    status: HttpStatus.BAD_REQUEST, message: Messages.APPLICATION_NOT_FOUND
                };
            }
            const totalPages = Math.ceil(totalApplications / limit);
            return { application, totalPages };
        } catch (error) {
            throw error;
        }
    };
    payAdvance = async (investorId: string, applicationId: string, data: Partial<IPayment>) => {
        const application = await this._applicationRepo.findById(applicationId);
        if (!application) throw { status: HttpStatus.BAD_REQUEST, message: Messages.APPLICATION_NOT_FOUND };

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_SECRET_KEY!,
        });

        const options = {
            amount: Number(data.amount) * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: { investorId, applicationId },
        };

        const order = await razorpay.orders.create(options);
        return { order, key: process.env.RAZORPAY_KEY_ID! };
    };

    verifyPayAdvance = async (investorId: string, applicationId: string, paymentId: string, orderId: string, signature: string, amount: number) => {
        const application = await this._applicationRepo.findById(applicationId);
        if (!application) throw { status: HttpStatus.BAD_REQUEST, message: Messages.APPLICATION_NOT_FOUND };
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== signature) {
            throw { status: HttpStatus.BAD_REQUEST, message: "Invalid signature, payment verification failed" };
        }

        const payment = await Payment.create({
            application: applicationId,
            investor: investorId,
            amount,
            transactionId: orderId,
            method: "razorpay",
            type: "advance",
            status: "success"
        });
        application.paymentStatus = "paid"
        application.save()
        return payment
    };

    applyReport = async (franchiseId: string, investorId: string, reason: string) => {
        try {
            const franchise = await this._FranchiseRepo.findByIdWithComapny(franchiseId)
            if (!franchise || !franchise.company) {
                throw {
                    status: HttpStatus.BAD_REQUEST, message: Messages.COMPANY_NOT_FOUND
                };
            }
            const companyId = franchise.company instanceof Types.ObjectId ? franchise.company : franchise.company._id;
            const data: IReport = {
                reportedBy: new Types.ObjectId(investorId),
                reportedAgainst: companyId,
                reason,
                status: "pending"
            }
            const createdReport = await this._reportRepo.create(data)
            const adminId = "$2b$10$fRCoV5J/OXDVA2wGEPLPL.NLeAlt8wnUpyKygCDC31K5B4xfGh.em"
            await this._notificationRepo.create({
                userId: new mongoose.Types.ObjectId(adminId),
                message: "An investor has applied a report. Please review it.",
                isRead: false,
            });
            return createdReport
        } catch (error) {
            throw error;
        }
    }
    getNotification = async (userId: string) => {
        try {
            const notifications = await this._notificationRepo.findByUserId(userId)
            return notifications || []
        } catch (error) {
            throw error;
        }
    };
    updateNotification = async (notificationId: string) => {
        try {
            const notification = await this._notificationRepo.updateIsRead(notificationId)
            if (!notification) {
                throw ({ success: false, message: Messages.NOTIFICATION_NOT_FOUND });
            }
            return notification
        } catch (error) {
            throw error;
        }
    };
}
