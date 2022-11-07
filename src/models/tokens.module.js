import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
      token: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    {timestamps: true}
  );
  

// Created model from schema
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;

