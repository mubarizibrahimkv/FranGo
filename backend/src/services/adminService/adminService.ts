import { Messages } from "../../constants/messages";
import { IAdminService } from "../../interface/service/adminServiceInterface";
import { IIndustryCategoryRepo } from "../../interface/ṛepository/adminIndustryCategoryInterface";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";
import { IProductCategoryRepo } from "../../interface/ṛepository/productCategoryInterface";
import { IRepoortRepo } from "../../interface/ṛepository/reportRepoInterface";
import { IIndustryCategory } from "../../models/industryCategoryModel";

export class AdminService implements IAdminService {
    constructor(private _IndustryCategoryRepo: IIndustryCategoryRepo, private _ProductCategoryRepo: IProductCategoryRepo,private _reportRepo:IRepoortRepo,private _notificationRepo:INotificationRepo) { }
    addIndustryCategory = async (data: IIndustryCategory) => {
        try {
            const industry = await this._IndustryCategoryRepo.create(data);
            return industry;
        } catch (error) {
            throw error;
        }
    };
    editIndustryCategory = async (data: IIndustryCategory) => {
        try {
            const id = data?._id;
            const category = await this._IndustryCategoryRepo.findById(id);
            if (!category) {
                throw ({ success: false, message: Messages.INDUSTRY_CATEGORY_NOT_FOUND });
            }
            const updated = await this._IndustryCategoryRepo.update(id, data);
            if (!updated) {
                throw ({ success: false, message: Messages.UPDATE_FAILED });
            }
            return updated;
        } catch (error) {
            throw error;
        }
    };
    getIndustryCategory = async () => {
        try {
            const industries = await this._IndustryCategoryRepo.findAll();
            console.log(industries);
            return industries;
        } catch (error) {
            throw error;
        }
    };
    deleteIndustryCategory = async (id: string) => {
        try {
            const industry = await this._IndustryCategoryRepo.findById(id);
            if (!industry) {
                throw ({ success: false, message: Messages.INDUSTRY_CATEGORY_NOT_FOUND });
            }
            const deleted = await this._IndustryCategoryRepo.delete(id);
            if (!deleted) {
                throw ({ success: false, message: Messages.DELETE_FAILED });
            }
            return deleted;
        } catch (error) {
            throw error;
        }
    };
    getReports = async () => {
        try {
            const reports=await this._reportRepo.findAllWithCompanyAndInvestor();
            return reports;
        } catch (error) {
            throw error;
        }
    };
    getNotification = async (userId:string) => {
        try {
            const notifications=await this._notificationRepo.findByUserId(userId);
            return notifications||[];
        } catch (error) {
            throw error;
        }
    };
    updateNotification = async (notificationId:string) => {
        try {
            const notification=await this._notificationRepo.updateIsRead(notificationId);
            if(!notification){
                throw ({ success: false, message: Messages.NOTIFICATION_NOT_FOUND });
            }
            return notification;
        } catch (error) {
            throw error;
        }
    };
}   