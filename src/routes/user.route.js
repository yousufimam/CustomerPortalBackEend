import express from "express";

import * as userController from "../controllers/user.controller.js";
import { createUser } from "../controllers/global.controller.js";

import {authorizeRole} from "../middlewares/authorization.middleware.js"
import ROLES from "../utils/permissions/roles_list.js";
import {authenticateUser} from "../middlewares/user.middleware.js"

const router = express.Router();

// For all users
router.route("")
    .get(authorizeRole(ROLES.Admin), userController.fetchAllUsers)
    .post(authorizeRole(ROLES.Admin), createUser)

// For the specific user route
router.route("/:id")
    .get(authenticateUser, userController.fetchSpecificUser)
    .patch(authenticateUser, userController.updateSpecificUser)
    .delete(authenticateUser, userController.deleteSpecificUser);

    
export default router;