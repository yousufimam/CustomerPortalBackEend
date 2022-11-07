import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import ROLES from "../utils/permissions/roles_list.js";
import {authorizeRole, authorizeMultipleRoles} from "../middlewares/authorization.middleware.js";
const router = express.Router();

router.route("")
    .get(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]),paymentController.getAllPaymentDetails)
    .post(paymentController.createPaymentDetail);

// router.route("/:userId")
//     .get(paymentController.getPaymentDetail)
//     // .patch(paymentController.updatePaymentDetail);

// router.route("/:userId/:orderId")
//     .get(paymentController.getPaymentDetailsUserWithOrder)
//     .patch(paymentController.updatePaymentDetail)
//     .delete(paymentController.deletePaymentDetail);

router.route("/:paymentId")
    .get(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), paymentController.getPaymentDetailWithId)
    .patch(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), paymentController.updatePaymentDetailWithId)
    .delete(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), paymentController.deletePaymentDetailWithId);

export default router;
