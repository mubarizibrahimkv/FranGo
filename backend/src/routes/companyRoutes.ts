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
import { ProductCategoryRepo } from "../repository/productCategoryRepository";
import { ProductManagementController } from "../controllers/company/productManagementController";
import { IndustryCategoryRepo } from "../repository/industryCategoryRepository";
import { ProductRepo } from "../repository/productRepository";
import { NotificationRepo } from "../repository/notificationRepository";
import { CouponRepository } from "../repository/couponRepository";
import { OfferRepository } from "../repository/offerRepository";
import { DiscountService } from "../services/companyService/discountService";
import { DiscountController } from "../controllers/company/discountController";
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


const couponRepo=new CouponRepository();
const offerRepo=new OfferRepository();
const discountService=new DiscountService(companyRepo,offerRepo,couponRepo);
const discountController=new DiscountController(discountService);

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
router.route("/profile/reapply/:companyId").put(companyAuth,profileController.reapply);
router.route("/franchise/:companyId").get(companyAuth,profileController.getFranchise).post(companyAuth,profileController.addFranchise);
router.route("/franchise/:franchiseId").put(companyAuth,profileController.editFranchise).delete(companyAuth,profileController.deleteFranchise);
router.get("/franchise/getFranchise/:franchiseId",companyAuth,profileController.franchiseDetails);

router
  .route("/profile/:companyId")
  .get(profileController.getProfile)
  .put(companyAuth,profileController.updateProfile);
router.put("/profile/:companyId/changeLogo",companyAuth,upload.single("companyLogo"), profileController.updateLogo);
router.route("/application/:companyId").get(companyAuth,profileController.getApplications);
router.put("/application/:applicationId",companyAuth,profileController.changeApplicationStatus);
router.route("/productCategory/:companyId").post(companyAuth,productManagementController.addProductCategory).get(companyAuth,productManagementController.getAllProductCategories);
router.route("/productCategory/:companyId/:categoryId").put(companyAuth,productManagementController.editProductCategories).delete(companyAuth,productManagementController.deleteProductCategories);
router.post("/subscription/:companyId",companyAuth,profileController.createSubscription);
router.post("/subscription/verify/:companyId",companyAuth,profileController.verifySubscription);
router.route("/product/:companyId").post(companyAuth,upload.array("images", 3),productManagementController.addProduct);
router.route("/product/:companyId/:productId").put(companyAuth,upload.array("images", 3),productManagementController.editProduct);
router.delete("/product/:productId",companyAuth,productManagementController.deleteProduct);
router.get("/product/:companyId",companyAuth,productManagementController.getProducts);
router.get("/:userId/notifications",profileController.getNotifications);
router.put("/notifications/:notificationId", profileController.updateNotification);
router.get("/subscription/status/:companyId", profileController.getSubscriptionStatus);

router.route("/offer/:companyId").post(discountController.addOffer).get(discountController.getOffer).patch(discountController.deleteOffer).put(discountController.updateOffer);
router.route("/coupon/:companyId").post(discountController.addCoupon).get(discountController.getCoupon).patch(discountController.deleteCoupon).put(discountController.updateCoupon);

export default router; 