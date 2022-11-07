import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


// Defining Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {type: String},
    userRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userId: {type: String},
    orderStatus: {type: String, enum : ['cancelled', 'approval', 'processing', 'packing', 'shipping', 'delivered']},
    total: {type: Number},
    // paymentStatus: {type: String, enum: ['paid', 'pending']},
    // paymentMethod: {type: String, enum: ['card', 'cash']},
    shippingMethod: {type: String, required: true},
    deleteStatus: {type: Boolean, required: true},
    paymentRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
    expectedDeliveryDate: Date,
    orderPlaced: Date,
    // prodRefId: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}]
    products: [{
      quantity: Number,
      unit_price: Number,
      prodRefId: {type: mongoose.Schema.Types.ObjectId, ref: "Product"}
    }]
    
  },
   {timestamps: true}
);


orderSchema.plugin(mongoosePaginate)
// Created model from schema
const Order = mongoose.model("Order", orderSchema);

export default Order;


