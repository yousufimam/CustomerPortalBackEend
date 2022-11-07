import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const orderDetailSchema = new mongoose.Schema(
  {
    // orderId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Order"
    // },
    // productId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product"
    // }
    orderId: {
      type: String,
      ref: "Order"
  },
  productId: {
      type: String,
      ref: "Product"
  },
    quantity: {type: Number, min: 0, default: 0},
    price: {type: Number, min: 0, default: 0},
    deleteStatus: Boolean
  },
  {timestamps: true}
);

orderDetailSchema.plugin(mongoosePaginate);
// Created model from schema
const orderDetail = mongoose.model("orderDetail", orderDetailSchema);

export default orderDetail;


