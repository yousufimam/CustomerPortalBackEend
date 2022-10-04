import express from "express";

import authenticateToken from "../middlewares/authenticate.middleware.js";
import * as userController from "../controllers/user.controller.js";
import { createUser } from "../controllers/global.controller.js";

const router = express.Router();

// For all users
router.route("")
    .get(authenticateToken, userController.fetchAllUsers)
    .post(createUser)

// For the specific user route
router.route("/:userId")
    .get(authenticateToken, userController.fetchSpecificUser)
    .patch(userController.updateSpecificUser)
    .delete(userController.deleteSpecificUser);

    
export default router;