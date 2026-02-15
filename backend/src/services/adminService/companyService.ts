import mongoose from "mongoose";
import { Messages } from "../../constants/messages";
import { IAdminCompanyService } from "../../interface/service/adminCompanyServiceInterface";
import { IAdminCompanyRepo } from "../../interface/ṛepository/adminCompanyRepoInterface";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";
import Company from "../../models/companyModel";
import { CompanyMapper } from "../../mappers/company.mapper";
import { io } from "../../config/socket";

export class AdminCompanyService implements IAdminCompanyService {
  constructor(private _companyRepo: IAdminCompanyRepo, private _notificationRepo: INotificationRepo) { }

  getPendingCompanies = async (page: number, search: string) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const totalCompanies = await Company.countDocuments({ status: "pending" });
      const totalPages = Math.ceil(totalCompanies / limit);
      const users = await this._companyRepo.getPendingCompanies(limit, skip, search);
      if (!users) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return { users: CompanyMapper.toResponseList(users), totalPages };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to get pending companies");
    }
  };

  getApprovedCompanies = async (page: number, search: string, filter: string) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const companies = await this._companyRepo.getApprovedCompanies(limit, skip, search, filter);
      const totalCompanies = await Company.countDocuments({ status: "approve" });
      const totalPages = Math.ceil(totalCompanies / limit);
      if (!companies) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return { companies: CompanyMapper.toResponseList(companies), totalPages };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to get approved companies");
    }
  };

  changeStatusCompany = async (companyId: string, status: "reject" | "approve", reason?: string) => {
    try {
      const company = await this._companyRepo.findCompanyById(companyId);
      if (!company) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      company.status = status;
      if (reason) {
        company.rejectionReason = reason.trim();
      }
      await company.save();

      const notificationMessage = status === "approve" ? "Your company registration has been approved!" : "Your company registration has been rejected!";

      const notification = await this._notificationRepo.create({
        userId: new mongoose.Types.ObjectId(companyId),
        message: notificationMessage,
        isRead: false,
      });


      io.to(companyId).emit("receive_notification", {
        id: notification._id,
        message: notification.message,
        createdAt: notification.createdAt,
        isRead: false,
      });

      return;
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to update company status");
    }
  };

  blockCompany = async (companyId: string, block: boolean) => {
    try {
      const company = await this._companyRepo.blockCompany(companyId, block);
      if (!company) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return;
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to block company");
    }
  };

  getCompanyDetails = async (id: string) => {
    try {
      const company = await this._companyRepo.findCompanyById(id);
      if (!company) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return CompanyMapper.toProfile(company);
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to fetch company details");
    }
  };
}
