import Express from "express";
import { CustomerAuthRepo } from "../repository/customerAuthRepository";
import { CustomerAddressRepo } from "../repository/customerRepository";
import { CustomerProfileService } from "../services/customerService/customerProfileService";
import { CustomerProfileController } from "../controllers/customer/customerProfileController";
import { CustomerAuthService } from "../services/customerService/customerAuthService";
import { CustomerAuthController } from "../controllers/customer/customerAuthController";
import passport, { setupGoogleStrategy } from "../config/passport";
const router = Express.Router();


const authRepo = new CustomerAuthRepo();
const authService=new CustomerAuthService(authRepo);
const authController=new CustomerAuthController(authService);

const addressRepo = new CustomerAddressRepo();
const profileService = new CustomerProfileService(addressRepo, authRepo);
const profileController = new CustomerProfileController(profileService);


router.route("/auth/register").post(authController.register);
router.route("/auth/verify-otp").post(authController.verifyOtp);
router.route("/auth/resend-otp").post(authController.resendOtp);
router.route("/auth/login").post(authController.login);
router.route("/auth/login/forgot-password").post(authController.forgetPassword);
router.route("/auth/login/changePassword").post(authController.changePassword);
router.route("/profile/changePassword/:userId").put(profileController.changePassword);


setupGoogleStrategy("customer");

router.get(
  "/google",
  passport.authenticate("customer-google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("customer-google"),
  authController.googleCallBack
);
router.get("/google/success", authController.getGoogleUser);


router.route("/profile/:customerId").get(profileController.getCustomer);


router.route("/profile/address/:customerId")
    .post(profileController.addAddress)
    .get(profileController.getAddress);

router.route("/profile/address/:addressId")
    .put(profileController.editAddress)
    .delete(profileController.deleteAddress);

export default router;