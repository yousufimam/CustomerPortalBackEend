import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const userSchema = new mongoose.Schema(
  {
    userId: String,
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String, required: true},
    verified: Boolean,
    deleteStatus: Boolean,
    role: {type: String},
    shippingInfo: {
      courier: String,
      trackingNumber: String,
      address: String
    }
  },
  {timestamps: true}
);

userSchema.plugin(mongoosePaginate);

// Created model from schema
const User = mongoose.model("User", userSchema);

export default User;


