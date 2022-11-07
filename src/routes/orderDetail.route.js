import express from "express";
import * as orderDetailController from "../controllers/orderDetails.controller.js";

import { check } from "express-validator";

const router = express.Router();

router.route("")
    .get(orderDetailController.getAllOrderDetails)
    .post([
        check('quantity').not().isEmpty().trim().escape(),
        check('price').not().isEmpty().trim().escape()
    ], orderDetailController.createOrderDetail);

router.route("/:orderId")
    .get(orderDetailController.getSpecificOrderDetails)
    .patch([
        check('quantity').not().isEmpty().trim().escape(),
        check('price').not().isEmpty().trim().escape()
    ], orderDetailController.updateSpecificOrderDetails)
    .delete(orderDetailController.deleteSpecificOrderDetails);

export default router;
