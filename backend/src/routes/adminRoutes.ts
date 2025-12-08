import express from "express";
import { AdminCompanyRepo } from "../repository/adminCompanyRepository";
import { AdminCompanyService } from "../services/adminService/companyService";
import { AdminConmpanyController } from "../controllers/admin/companyController";
import { AdminInvestorRepo } from "../repository/adminInvestorRepository";
import { AdminInvestorService } from "../services/adminService/investorService";
import { AdminInvestorController } from "../controllers/admin/invetorController";
import { AdminCustomerRepo } from "../repository/adminCustomerRepository";
import { AdminCustomerService } from "../services/adminService/customerService";
import { AdminCustomerController } from "../controllers/admin/customerController";
import { adminAuth } from "../middleware/adminAuth";
import { IndustryCategoryRepo } from "../repository/industryCategoryRepository";
import { AdminService } from "../services/adminService/adminService";
import { Admincontroller } from "../controllers/admin/adminController";
import { ProductCategoryRepo } from "../repository/productCategory";
import { ReportRepo } from "../repository/reportRepository";
import upload from "../config/multer";
import { NotificationRepo } from "../repository/notificationRepository";
const router = express.Router();

const companyRepo=new AdminCompanyRepo();
const notificationRepo=new NotificationRepo();
const companyService=new AdminCompanyService(companyRepo,notificationRepo);
const companyController=new AdminConmpanyController(companyService);

const customerRepo=new AdminCustomerRepo();
const customerService=new AdminCustomerService(customerRepo);
const customerController=new AdminCustomerController(customerService);

const reportRepo=new ReportRepo();
const productCategoryRepo=new ProductCategoryRepo();
const industryCategoryRepo=new IndustryCategoryRepo();
const adminService=new AdminService(industryCategoryRepo,productCategoryRepo,reportRepo,notificationRepo);
const adminController=new Admincontroller(adminService);

const investorRepo=new AdminInvestorRepo();
const investorService=new AdminInvestorService(investorRepo,notificationRepo);
const investorController=new AdminInvestorController(investorService);

router.get("/company/pending",adminAuth,companyController.getPendingCompanies);
router.get("/company",adminAuth,companyController.getApprovedCompanies);
router.get("/company/:id",adminAuth,companyController.getCompanyDetails);
router.put("/company/verify/:companyId",adminAuth,companyController.changeStatusCompany);
router.put("/company/block/:companyId",adminAuth,companyController.blockCompany);


router.get("/investor/pending",adminAuth,investorController.getPendingInvestors);
router.get("/investor",adminAuth,investorController.getApprovedInvestors);
router.get("/investor/:id",adminAuth,investorController.getInvestorDetails);
router.put("/investor/verify/:investorId",adminAuth,investorController.changeStatusInvestor);
router.put("/investor/block/:investorId",adminAuth,investorController.blockInvestor);

router.get("/customer",adminAuth,customerController.getCustomers);
router.put("/customer/block/:customerId",adminAuth,customerController.blockCustomer);
router.route("/industryCategory").post(adminAuth,upload.single("image"),adminController.addIndustryCategory).get(adminController.getIndustryCategory).put(adminAuth,upload.single("image"),adminController.editIndustryCategory);
router.route("/industryCategory/:categoryId").delete(adminController.deleteIndustryCategory);
router.route("/report").get(adminController.getReports);
router.get("/:userId/notifications",adminController.getNotifications);
router.put("/notifications/:notificationId", adminController.updateNotification);


export default router;  