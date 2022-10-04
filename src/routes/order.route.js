import express from "express";
import * as orderController from "../controllers/order.controller.js"

const router = express.Router();

router.route("")
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

router.route("/:orderId")
    .get(orderController.getSpecificOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);

router.route("/:userId")
    .get(orderController.getSpecificUserOrders);

export default router;
