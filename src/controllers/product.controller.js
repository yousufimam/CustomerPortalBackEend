import Product from "../models/product.module.js";
import {StatusCodes} from 'http-status-codes';

// All products
const fetchAllProducts = async (req, res) => {
  try {
    // Product.find({}, function (err, products) {
    //   if (products.length == 0) {
    //     res.sendStatus(StatusCodes.NOT_FOUND)
    //   } else {
    //     res.status(StatusCodes.OK).json(products);
    //   }
    // });
    const {page, perPage} = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(perPage) || 10
    }

    const products = await Product.paginate({}, options);
    if(products.totalDocs == 0){
        res.sendStatus(StatusCodes.NOT_FOUND)
    }
    else{
        res.status(StatusCodes.OK).json(products)
    }
  } catch (error) {
    res.json(error);
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, productId, productGeneratedId } = req.body;

    if (name === "" || productId === "" || productGeneratedId === "") {
      // throw new Error("Wrong credentials");
      res.sendStatus(StatusCodes.UNAUTHORIZED)
    }

    const existingProduct = await Product.findOne({
      productGeneratedId: productGeneratedId,
    });
    if (existingProduct) {
      // throw new Error("Product already exists");
      res.sendStatus(StatusCodes.CONFLICT)
    }

    const newProduct = new Product({
      name: name,
      productId: productId,
      productGeneratedId: productGeneratedId,
      price: req.body.price,
      quantity: req.body.quantity,
      stockQuantity: req.body.stockQuantity,
    });

    newProduct.save();
    res.status(StatusCodes.CREATED).json({
      status: "Created",
      message: "Product created successfully",
    });
  } catch (error) {
    res.json({
      status: "Fail",
      message: error.message,
    });
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
    const foundProd = await Product.findOne({
      productGeneratedId: req.params.prodGenId,
    });
    if (foundProd === null) {
      // throw new Error("Product not found");
      res.sendStatus(StatusCodes.NOT_FOUND)
    } else {
      res.status(StatusCodes.OK).json(foundProd);
    }
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updateProduct = (req, res) => {
  try {
    Product.findOneAndUpdate(
      { productGeneratedId: req.params.prodGenId },
      { $set: req.body },
      function (err, found) {
        if (err) {
          throw new Error("Error occured");
        }
        if (found == null) {
          // res.status(404).json({
          //   message: "Product not found",
          // });
          res.sendStatus(StatusCodes.NOT_FOUND)
        } else {
          // res.status(200).json({
          //   message: "Product updated successfully",
          // });
          res.sendStatus(StatusCodes.OK)
        }
      }
    );
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const deleteProduct = (req, res) => {
  try {
    Product.deleteOne(
      { productGeneratedId: req.params.prodGenId },
      function (err) {
        if (err) {
          throw new Error("Error occured");
        } else {
          // res.status(200).json({ message: "Product deleted successfully" });
          res.sendStatus(StatusCodes.OK)
        }
      }
    );
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export {
  fetchAllProducts,
  createProduct,
  deleteAllProducts,
  fetchProduct,
  updateProduct,
  deleteProduct,
};
