import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Defining Schema
const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    address: {type: String, required: true},
    verified: Boolean,
    deleteStatus: Boolean
  },
  {timestamps: true}
);

userSchema.plugin(mongoosePaginate);
// Created model from schema
const User = mongoose.model("User", userSchema);

export default User;


