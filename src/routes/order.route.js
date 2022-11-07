import express from "express";
import { check } from "express-validator";

import * as orderController from "../controllers/order.controller.js"
import ROLES from "../utils/permissions/roles_list.js";
import {authorizeRole, authorizeMultipleRoles} from "../middlewares/authorization.middleware.js";
import { authenticateUserOrders } from "../middlewares/user.middleware.js"


const router = express.Router();
router.route("")
    .get(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), orderController.getAllOrders)
    .post([
        check('orderStatus').not().isEmpty().trim().escape(),
        check('shippingMethod').not().isEmpty().trim().escape()
    ], authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), orderController.createOrder);

router.route("/:orderId")
    .get(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), orderController.getSpecificOrder)
    .patch([
        check('orderStatus').trim().escape(),
        check('total').trim().escape(),
        check('paymentStatus').trim().escape(),
        check('paymentMethod').trim().escape(),
        check('shippingMethod').trim().escape()
    ], authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), orderController.updateOrder)
    .delete(authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]), orderController.deleteOrder);


export default router;
