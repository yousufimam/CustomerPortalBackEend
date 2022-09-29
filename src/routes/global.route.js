import express from "express";
import * as globalController from "../controllers/global.controller.js";
import { createNewAccessToken } from "../controllers/auth.controller.js";
import { verifyOTP, resendOTPVerification } from "../controllers/otp.controller.js";


const router = express.Router();


// Sign Up route
router.route('/signup')
    .get(globalController.fetchSignUp)
    .post(globalController.createUser);


// Sign In route
router.route('/signin')
    .get(globalController.fetchSignIn)
    .post(globalController.logInUser);

// Logout route
router.route("/signout")
    .post(globalController.logOutUser);


// Verify OTP route
router.route("/verifyOTP")
    .post(verifyOTP);


// Resend OTP route
router.route("/resendOTP")
    .post(resendOTPVerification);


// New Access Token Creation route
router.route("/token")
    .post(createNewAccessToken);


export default router;

