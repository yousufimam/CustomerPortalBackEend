import mongoose from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    verified: Boolean,
  }
);

// Created model from schema
const User = mongoose.model("User", userSchema);

export default User;


