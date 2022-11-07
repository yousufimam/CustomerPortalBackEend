import express from "express";
import * as globalController from "../controllers/global.controller.js";
import { createNewAccessToken } from "../controllers/auth.controller.js";
import { verifyOTP, resendOTPVerification } from "../controllers/otp.controller.js";

import { check } from "express-validator";


const router = express.Router();

// Welcome route
router.route("")
    .get(globalController.welcomeRoute);

// Sign Up route
router.route('/signup')
    .get(globalController.fetchSignUp)
    .post([
        check('name').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail(),
        check('password').not().isEmpty().trim().escape(),
        check('phoneNumber').not().isEmpty().trim().escape(),
        check('address').not().isEmpty().trim().escape(),

      ], globalController.createUser);


// Sign In route
router.route('/signin')
    .get(globalController.fetchSignIn)
    .post([
        check('email').isEmail().normalizeEmail(),
        check('password').not().isEmpty().trim().escape(),
    ], globalController.logInUser);

// Logout route
router.route("/signout")
    .post(globalController.logOutUser);


// Verify OTP route
router.route("/verifyOTP")
    .post([
        check('email').isEmail().normalizeEmail(),
        check('otp').not().isEmpty().trim().escape(),
    ],
    verifyOTP);


// Resend OTP route
router.route("/resendOTP")
    .post([check('email').isEmail().normalizeEmail()], resendOTPVerification);


// New Access Token Creation route
router.route("/token")
    .post(createNewAccessToken);

router.route("/forgot-password")
    .get(globalController.getForgotPassword)
    .post(globalController.postForgotPassword);


router.route("/reset-password/:userId/:token")
    .get(globalController.getResetPassword)
    .post(globalController.postResetPassword);


export default router;

