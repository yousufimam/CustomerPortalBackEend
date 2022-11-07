import mongoose from "mongoose";


// Defining Schema
const contactSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: String,
    content: String,
    caption: String,
    images: Array
    
  },
   {timestamps: true}
);


// Created model from schema
const contact = mongoose.model("contact", contactSchema);

export default contact;


