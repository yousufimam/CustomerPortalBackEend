import express from "express";
import * as productController from "../controllers/product.controller.js";

import {
  authorizeRole,
  authorizeMultipleRoles,
} from "../middlewares/authorization.middleware.js";
import ROLES from "../utils/permissions/roles_list.js";

import { check } from "express-validator";

const router = express.Router();

import multer from "multer";

// const storage = multer.diskStorage({
//   destination: "./public/uploads/productImages/",
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_${file.fieldname}_${file.originalname}`);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router
  .route("/upload")
  .post(
    authorizeRole(ROLES.Admin),
    upload.array("productImage", 5),
    // upload.single("productImage"),
    productController.uploadProductImage
  );

router
  .route("")
  .get(
    authorizeMultipleRoles([ROLES.Admin, ROLES.Customer]),
    productController.getAllProducts
  )
  .post(
    [
      check("name").not().isEmpty().trim().escape(),
      check("productId").not().isEmpty().trim().escape(),
      check("price").not().isEmpty().trim().escape(),
      check("quantity").not().isEmpty().trim().escape(),
      check("stockQuantity").not().isEmpty().trim().escape(),
    ],
    authorizeRole(ROLES.Admin),
    productController.createProduct
  )
  // .post(authorizeRole(ROLES.Admin), upload.single('productImage'),
  // [
  //         check('name').not().isEmpty().trim().escape(),
  //         check('productId').not().isEmpty().trim().escape(),
  //         check('price').trim().escape(),
  //         check('quantity').trim().escape(),
  //         check('stockQuantity').trim().escape()
  //       ], productController.createProduct)
  .delete(productController.deleteAllProducts);

router
  .route("/:prodId")
  .get(productController.fetchProduct)
  .patch(authorizeRole(ROLES.Admin), productController.updateProduct)
  .delete(authorizeRole(ROLES.Admin), productController.deleteProduct);

export default router;
