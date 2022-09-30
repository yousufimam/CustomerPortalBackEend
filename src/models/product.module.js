import mongoose from "mongoose";

// Defining Schema
const productSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    productId: {type: String, required: true},
    productGeneratedId: {type: String, required: true},
    price: {type: Number, min: 0, default: 0},
    quantity: {type: Number, min: 0, default: 0},
    stockQuantity: {type: Number, min: 0, default: 0},
  }
);

// Created model from schema
const Product = mongoose.model("Product", productSchema);

export default Product;


