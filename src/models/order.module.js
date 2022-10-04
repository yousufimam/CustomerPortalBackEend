import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


// Defining Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {type: String, required: true},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderStatus: {type: String, enum : ['approval', 'processing', 'packing', 'shipping', 'delivered']},
    total: {type: Number},
    paymentStatus: {type: String, enum: ['paid', 'pending']},
    paymentMethod: {type: String, enum: ['card', 'cash']},
    shippingMethod: {type: String, required: true},
    deleteStatus: {type: Boolean, required: true},
    // paymentId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Payment"
    // }
    paymentId: {type: String},
    deliveryDate: Date,
  },
  {timestamps: true}
);


orderSchema.plugin(mongoosePaginate)
// Created model from schema
const Order = mongoose.model("Order", orderSchema);

export default Order;


