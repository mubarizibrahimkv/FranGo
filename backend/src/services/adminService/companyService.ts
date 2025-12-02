import mongoose, { mongo } from "mongoose";
import { Messages } from "../../constants/messages";
import { IAdminCompanyService } from "../../interface/service/adminCompanyServiceInterface";
import { IAdminCompanyRepo } from "../../interface/ṛepository/adminCompanyRepoInterface";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";
import Company from "../../models/companyModel";
import { INotification } from "../../models/notificationModel";

export class AdminCompanyService implements IAdminCompanyService {
  constructor(private _companyRepo: IAdminCompanyRepo, private _notificationRepo: INotificationRepo) { }

  getPendingCompanies = async (page: number) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const totalCompanies = await Company.countDocuments({ status: "pending" });
      const totalPages = Math.ceil(totalCompanies / limit);
      const users = await this._companyRepo.getPendingCompanies(limit, skip);
      if (!users) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return { users, totalPages };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to get pending companies");
    }
  };

  getApprovedCompanies = async (page: number) => {
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
      const companies = await this._companyRepo.getApprovedCompanies(limit, skip);
      const totalCompanies = await Company.countDocuments({ status: "approve" });
      const totalPages = Math.ceil(totalCompanies / limit);
      if (!companies) {
        throw new Error(Messages.COMPANY_NOT_FOUND);
      }
      return { companies, totalPages };
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
        company.rejectionReason = reason.trim()
      }
      await company.save();
      
      const notificationMessage=status==="approve"?"Your company registration has been approved!":"Your company registration has been rejected!"
     
      await this._notificationRepo.create({
        userId: new mongoose.Types.ObjectId(companyId),
        message: notificationMessage,
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
      return company;
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error("Failed to fetch company details");
    }
  };
}
