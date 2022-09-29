import mongoose from "mongoose";

// Defining Schema
const paymentSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {type: String, enum: ['received', 'cancelled']},
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }
  }
);

// Created model from schema
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


