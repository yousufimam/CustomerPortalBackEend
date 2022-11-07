import Product from "../models/product.module.js";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import { createMediaEndpointData } from "../utils/end_point/endpoint.utils.js";
import * as filters from "../helper/common/products.filter.js";
import {
  fetchData,
  fetchSpecificData,
  updateSpecificData,
} from "../utils/db_call_functions/products.db.js";
import {
  fetchEndpointData,
  createEndpointData,
  fetchSpecificEndpointData,
  updateSpecificEndpointData,
} from "../utils/end_point/endpoint.utils.js";
import * as status_codes from "../utils/status.codes.js";
import {productImage} from "../utils/image_upload/product_image.util.js";

// All products
const getAllProducts = async (req, res) => {
  try {
    const end_point = "/products";
    const { page, perPage } = req.query;
    const options = {
      select: "name productId category price status productImage productGenId",
      page: parseInt(page) || 1,
      limit: parseInt(perPage) || 50,
    };

    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const foundProduct = await fetchData(
        Product,
        filters.getAllProductsFilter(req),
        options
      );
      res.status(foundProduct.status).json(foundProduct.data);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await fetchEndpointData(
        req.query,
        "GET",
        `${process.env.BASEURL}${end_point}`,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res.json(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const end_point = "/products";
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: "Form validation error",
        errors: errors.array(),
      });
    } else {
      if (process.env.DATASOURCE === "db") {
        console.log("db");
        const data_created = createData(req, Product);
        res.status(data_created.status).json(data_created.message);
      } else {
        console.log("ep");
        const token = req.headers.authorization.split(" ")[1];
        const endpoint_data = await createEndpointData(
          "POST",
          process.env.BASEURL + end_point,
          req.body,
          token
        );
        res.status(endpoint_data.status).json(endpoint_data.data);
      }
    }
  } catch (error) {
    res.json(error);
  }
};

const deleteAllProducts = (req, res) => {
  try {
    Product.deleteMany({}, function (err) {
      if (err) {
        throw new Error("Error occured");
      } else {
        res.status(StatusCodes.OK).json({
          message: "Deleted Successfully",
        });
      }
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

// Specific products
const fetchProduct = async (req, res) => {
  try {
    const end_point = `/products/${req.params.prodId}`;
    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const foundData = await fetchSpecificData(Product, {
        productId: req.params.prodId,
      });
      res.status(foundData.status).json(foundData.data);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await fetchSpecificEndpointData(
        "GET",
        process.env.BASEURL + end_point,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError());
  }
};

const updateProduct = async (req, res) => {
  try {
    const end_point = `/products/${req.params.prodId}`;
    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const foundOrder = await updateSpecificData(
        Product,
        { productId: req.params.prodId },
        { $set: req.body }
      );
      res.status(foundOrder.status).json({ message: "Updated Successfully" });
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await updateSpecificEndpointData(
        "PATCH",
        process.env.BASEURL + end_point,
        req.body,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError());
  }
};

const deleteProduct = async (req, res) => {
  try {
    const end_point = `/products/${req.params.prodId}`;

    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const foundOrder = await updateSpecificData(
        Product,
        { productId: req.params.prodId },
        { deleteStatus: true }
      );
      res.status(foundOrder.status).json({ message: "Deleted Successfully" });
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await updateSpecificEndpointData(
        "DELETE",
        process.env.BASEURL + end_point,
        { deleteStatus: true },
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    // res.status(404).json({
    //   status: "Failed",
    //   message: error.message,
    // });
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError());
  }
};

// Upload image route
const uploadProductImage = async (req, res) => {
  try {
    const end_point = "/products/upload";
    if (process.env.DATASOURCE === "db") {
      // console.log("db");
      // const images_info = [];
      // const images = req.files;
      // images.map((file) =>
      //   images_info.push({
      //     name: file.filename,
      //     url: req.headers.host + "/" + file.path,
      //   })
      // );
      // console.log("paths ==>", images_info)
      // res.status(StatusCodes.OK).json(formatUploadFile(req.files));

      // console.log(productImage(req))
      res.status(StatusCodes.OK).json(productImage(req));

    } else {
      console.log("ep");

      const token = req.headers.authorization.split(" ")[1];
      createMediaEndpointData(
        "POST",
        process.env.BASEURL + end_point,
        req.files,
        token
      );

      // res.status(201).json(images_info);
    }
  } catch (error) {
    console.log("Error", error);
  }
};
export {
  getAllProducts,
  createProduct,
  deleteAllProducts,
  fetchProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
