import upload from "../config/multer";
import { CompanyAuthController } from "../controllers/company/authController";
import  Express  from "express";
import { CompanyProfileRepository } from "../repository/companyProfileRepository";
import { CommpanyProfileService } from "../services/companyService/companyProfileService";
import { ProfileController } from "../controllers/company/companyProfileController";
import { companyAuth } from "../middleware/companyAuth";
import { CompanyAuthRepository } from "../repository/companyAuthRepository";
import { CompanyAuthService } from "../services/companyService/companyAuthService";
import passport, { setupGoogleStrategy } from "../config/passport";
import { FranchiseRepo } from "../repository/franchiseRepository";
import { ApplicationRepo } from "../repository/applicationRepository";
import { ProductManagementService } from "../services/companyService/companyProductManagementService";
import { ProductCategoryRepo } from "../repository/productCategory";
import { ProductManagementController } from "../controllers/company/productManagementController";
import { IndustryCategoryRepo } from "../repository/industryCategoryRepository";
import { ProductRepo } from "../repository/productRepository";
import { NotificationRepo } from "../repository/notificationRepository";
const router=Express.Router();

const companyAuthRepo=new CompanyAuthRepository();
const companyAuthService=new CompanyAuthService(companyAuthRepo);
const authController=new CompanyAuthController(companyAuthService);

const companyRepo=new CompanyProfileRepository();
const franchiseRepo=new FranchiseRepo();
const applicationRepo=new ApplicationRepo();
const notificationRepo=new NotificationRepo();
const companyService=new CommpanyProfileService(companyRepo,franchiseRepo,applicationRepo,notificationRepo);
const profileController=new ProfileController(companyService);

const productCategoryRepo=new ProductCategoryRepo();
const productRepo=new ProductRepo();
const industryCategoryRepo=new IndustryCategoryRepo();
const productManagementService=new ProductManagementService(productCategoryRepo,industryCategoryRepo,productRepo);
const productManagementController=new ProductManagementController(productManagementService);

setupGoogleStrategy("company");

router.get("/google",passport.authenticate("company-google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("company-google"),authController.googleCallBack);
router.get("/google/success", authController.getGoogleUser);

router.route("/auth/register").post(upload.fields([{ name: "registrationProof", maxCount: 1 },{ name: "companyLogo", maxCount: 1 }]),authController.register);

router.get("/auth/verify-email", authController.verifyEmail);
router.post("/auth/login/forgot-password", authController.forgotPassword);
router.post("/auth/verify-email/resendLink", authController.resendLink);
router.route("/auth/login").post(authController.login);
router.route("/auth/login/changePassword").post(authController.changePassword);
router.route("/profile/changePassword/:userId").put(profileController.changePassword);
router.route("/profile/reapply/:companyId").put(profileController.reapply);
router.route("/franchise/:companyId").get(profileController.getFranchise).post(profileController.addFranchise);
router.route("/franchise/:franchiseId").put(profileController.editFranchise).delete(profileController.deleteFranchise);
router.get("/franchise/getFranchise/:franchiseId",profileController.franchiseDetails);

router
  .route("/profile/:companyId")
  .get(profileController.getProfile)
  .put(companyAuth,profileController.updateProfile);
router.put("/profile/:companyId/changeLogo",companyAuth,upload.single("companyLogo"), profileController.updateLogo);
router.route("/application/:companyId").get(profileController.getApplications);
router.put("/application/:applicationId",profileController.changeApplicationStatus);
router.route("/productCategory/:companyId").post(productManagementController.addProductCategory).get(productManagementController.getAllProductCategories);
router.route("/productCategory/:companyId/:categoryId").put(productManagementController.editProductCategories).delete(productManagementController.deleteProductCategories);
router.post("/subscription/:companyId",profileController.createSubscription);
router.post("/subscription/verify/:companyId",profileController.verifySubscription);
router.route("/product/:companyId").post(upload.array("images", 3),productManagementController.addProduct);
router.route("/product/:companyId/:productId").put(upload.array("images", 3),productManagementController.editProduct);
router.delete("/product/:productId",productManagementController.deleteProduct);
router.get("/product/:companyId",productManagementController.getProducts);
router.get("/:userId/notifications",profileController.getNotifications);
router.put("/notifications/:notificationId", profileController.updateNotification);

export default router; 