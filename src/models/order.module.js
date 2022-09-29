import mongoose from "mongoose";

// Defining Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {type: String, required: true},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderStatus: {type: String, enum : ['awaiting approval', 'order processing', 'order packing', 'awaiting shipping', 'order delivered']},
    total: {type: Number},
    deliveryDate: Date,
    paymentStatus: {type: String, enum: ['paid', 'pending']},
    paymentType: {type: String, enum: ['card', 'cash']},
    shippingMethod: {type: String, required: true},
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    }
  },
  {timestamps: true}
);

// Created model from schema
const Order = mongoose.model("Order", orderSchema);

export default Order;


