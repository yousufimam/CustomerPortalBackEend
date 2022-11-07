import express from "express";
import global from "./global.route.js";
import user from "./user.route.js";
import product from "./product.route.js";
import order from "./order.route.js";
import orderDetail from "./orderDetail.route.js";
import paymentDetail from "./payment.route.js";
import authenticateToken from "../middlewares/authenticate.middleware.js"
import authenticateIdSecret from "../middlewares/endpoint.middleware.js";
import contact from "./contact.route.js";


var router = express.Router();

// Load routes
router.use('/', authenticateIdSecret,global)

router.use('/users', authenticateIdSecret, authenticateToken, user)

router.use("/products", authenticateIdSecret, authenticateToken, product)

router.use("/order-management", authenticateIdSecret, authenticateToken, order)

router.use("/orderDetails", authenticateIdSecret, authenticateToken, orderDetail)

router.use("/paymentDetails", authenticateIdSecret, authenticateToken, paymentDetail)

router.use("/contact", authenticateToken, contact)


export default router;