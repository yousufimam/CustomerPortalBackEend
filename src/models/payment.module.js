import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const paymentSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {type: String, enum: ['received', 'cancelled']},
    // orderId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Order"
    // }
    orderId: {
      type: String,
      ref: "Order"
  },
    deleteStatus: {type: Boolean, required: true},
  },
  {timestamps: true}
);

paymentSchema.plugin(mongoosePaginate);
// Created model from schema
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


