import express from "express";
import { ProfileController } from "../controllers/investor/profileController";
import { AuthController } from "../controllers/authController";
import upload from "../config/multer";
import { investorAuth } from "../middleware/investorAuth";
import { AuthRepository } from "../repository/authRepostory";
import { AuthService } from "../services/authService";
import { ProfileRepository } from "../repository/profileRepository";
import { ProfileService } from "../services/investorService/profileService";
import passport, { setupGoogleStrategy } from "../config/passport";
import { IndustryCategoryRepo } from "../repository/industryCategoryRepository";
import { InvestorService } from "../services/investorService/investorService";
import { FranchiseRepo } from "../repository/franchiseRepository";
import { InvestorController } from "../controllers/investor/investorController";
import { ApplicationRepo } from "../repository/applicationRepository";
import { ReportRepo } from "../repository/reportRepository";
import { NotificationRepo } from "../repository/notificationRepository";
const router = express.Router();
 
const authRepo = new AuthRepository();
const authService = new AuthService(authRepo);
const authController = new AuthController(authService);

const industryCategoryRepo=new IndustryCategoryRepo();
const profileRepo = new ProfileRepository();
const notificationRepo=new NotificationRepo();
const profileService = new ProfileService(authRepo, profileRepo,industryCategoryRepo,notificationRepo);
const profileController = new ProfileController(profileService);
 
const reportRepo=new ReportRepo();
const franchiseRepo=new FranchiseRepo();
const applicationRepo=new ApplicationRepo();
const investorService=new InvestorService(franchiseRepo,profileRepo,applicationRepo,reportRepo,notificationRepo);
const investorController=new InvestorController(investorService);

setupGoogleStrategy("investor");
router.get("/google",passport.authenticate("investor-google", { scope: ["profile", "email"] }));
router.get("/google/callback",passport.authenticate("investor-google"),authController.googleCallBack);
router.get("/google/success", authController.getGoogleUser);

router.route("/auth/register").post(authController.register);
router.route("/auth/refresh").post(authController.refresh);
router.route("/auth/verify-otp").post(authController.verifyOtp);
router.route("/auth/resend-otp").post(authController.resendOtp);
router.route("/auth/login").post(authController.login);
router.route("/auth/login/forgot-password").post(authController.forgetPassword);
router.route("/auth/login/changePassword").post(authController.changePassword);
router.route("/:seekerId/profile").get(investorAuth, profileController.getProfile).put(upload.single("profileImage"), profileController.updateProfileImage);
router.route("/:seekerId/updateProfile").put(investorAuth, profileController.updateProfile);
router.route("/profile/reapply/:investorId").put(profileController.reapply);
router.route("/profile/changePassword/:userId").put(profileController.changePassword);
router.post("/auth/logout/:id", authController.logoutUser);
router.get("/franchises",investorController.getFranchises);
router.get("/franchise/:franchiseId",investorController.getFranchiseDetails);
router.post("/franchise/:investorId/:franchiseId",investorAuth,investorController.createApplication);
router.route("/applications/:investorId").get(investorController.getApplications);
router.post("/applications/payAdvance/:investorId/:applicationId",investorController.payAdvance);
router.post("/application/verifyPayAdvance/:investorId/:applicationId",investorController.verifyPayAdvance);
router.post("/report/franchise/:investorId",investorController.applyReport);
router.get("/:userId/notifications",investorController.getNotifications);
router.put("/notifications/:notificationId", investorController.updateNotification);
router.get("/myFranchises/:investorId",investorController.getMyFranchises);


export default router;