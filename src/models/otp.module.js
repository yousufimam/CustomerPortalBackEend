import mongoose from "mongoose";

// Defining Schema
const userOTPVerificationSchema = new mongoose.Schema(
  {
    otp: String,
    createdAt: Date,
    expiresAt: Date,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
);

// Created model from schema
const UserOTPVerification = mongoose.model("UserOTPVerification", userOTPVerificationSchema);

export default UserOTPVerification;
