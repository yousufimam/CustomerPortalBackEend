import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const productSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    productId: {type: String, required: true, unique: true},
    productGenId: {type: String, unique: true},
    status: {type: String, enum: ['available', 'outOfStock']},
    category: {type: String},
    price: {type: Number, min: 0, default: 0},
    quantity: {type: Number, min: 0, default: 0},
    stockQuantity: {type: Number, min: 0, default: 0},
    productImage: {type: Array},
    deleteStatus: {type: String}
  },
  {timestamps: true}
);

productSchema.plugin(mongoosePaginate);
// Created model from schema
const Product = mongoose.model("Product", productSchema);

export default Product;


