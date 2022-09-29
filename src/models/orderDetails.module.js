import mongoose from "mongoose";

// Defining Schema
const orderDetailSchema = new mongoose.Schema(
  {
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {type: Number, min: 0, default: 0},
    price: {type: Number, min: 0, default: 0}
  },
  {timestamps: true}
);

// Created model from schema
const orderDetail = mongoose.model("orderDetail", orderDetailSchema);

export default orderDetail;


