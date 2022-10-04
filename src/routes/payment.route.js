import express from "express";
import * as paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.route("")
    .get(paymentController.getAllPaymentDetails)
    .post(paymentController.createPaymentDetail);

router.route("/:userId")
    .get(paymentController.getPaymentDetail)
    // .patch(paymentController.updatePaymentDetail);

router.route("/:userId/:orderId")
    .get(paymentController.getPaymentDetailsUserWithOrder)
    .patch(paymentController.updatePaymentDetail)
    .delete(paymentController.deletePaymentDetail);


export default router;
