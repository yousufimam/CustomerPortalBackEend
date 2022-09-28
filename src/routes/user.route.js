import express from "express";
import authenticateToken from "../middlewares/authenticate.middleware.js";
import * as userController from "../controllers/user.controller.js";
import { createNewAccessToken } from "../controllers/auth.controller.js";
import { verifyOTP, resendOTPVerification } from "../controllers/otp.controller.js";


const router = express.Router();


// Sign Up route
router.route('/signup')
    .get(userController.fetchSignUp)
    .post(userController.createUser);


// Sign In route
router.route('/signin')
    .get(userController.fetchSignIn)
    .post(userController.logInUser);


// Success route
router.route('/success')
    .get(authenticateToken, userController.fetchSuccess);


// Verify OTP route
router.route("/verifyOTP")
    .post(verifyOTP);


// New Access Token Creation route
router.route("/token")
    .post(createNewAccessToken);


// Resend OTP route
router.route("/resendOTP")
    .post(resendOTPVerification);


// Fetch the authenticated user route
router.route("/fetchUser")
    .get(authenticateToken, userController.fetchSpecificUser)


// Logout route
router.route("/logout")
    .post(userController.logOutUser);

export default router;

