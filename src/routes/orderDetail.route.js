import express from "express";
import * as orderDetailController from "../controllers/orderDetails.controller.js";

const router = express.Router();

router.route("")
    .get(orderDetailController.getAllOrderDetails)
    .post(orderDetailController.createOrderDetail);

router.route("/:orderId")
    .get(orderDetailController.getSpecificOrderDetails)
    .patch(orderDetailController.updateSpecificOrderDetails)
    .delete(orderDetailController.deleteSpecificOrderDetails);

export default router;
