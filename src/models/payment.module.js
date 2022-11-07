import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const paymentSchema = new mongoose.Schema(
  {
    paymentId: {type: String},
    userRefId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    userId: {type: String},
    status: {type: String, enum: ['paid', 'unpaid']},
    method: {type: String, enum: ['card', 'cash']},
    orderRefId: {type: mongoose.Schema.Types.ObjectId, ref: "Order"},
    deleteStatus: {type: Boolean, required: true},
    paymentDate: Date
  },
  {timestamps: true}
);

paymentSchema.plugin(mongoosePaginate);
// Created model from schema
const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;


