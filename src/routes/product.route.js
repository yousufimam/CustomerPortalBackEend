import express from "express";
import * as productController from "../controllers/product.controller.js"

const router = express.Router();

router.route("")
    .get(productController.fetchAllProducts)
    .post(productController.createProduct)
    .delete(productController.deleteAllProducts);

router.route("/:prodGenId")
    .get(productController.fetchProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);



export default router;
