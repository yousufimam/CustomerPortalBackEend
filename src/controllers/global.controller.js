import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.module.js";
import RefreshToken from "../models/tokens.module.js";
import {sendOTPVerificationEmail} from "./otp.controller.js";
import { generateAccessToken } from "./auth.controller.js";


// GET controllers

const fetchSignUp = (req, res) => {
  return res.status(200).json({ message: "Successfully logged up" });
};

const fetchSignIn = (req, res) => {
  return res.status(200).json({ message: "Successfully logged in" });
};








// ******* SIGNUP *******
const createUser = async function (req, res) {
  const { name, email, password } = req.body;

  if (name === "" || email === "" || password === "") {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));


  const newUser = new User({
    name: name,
    email: req.body.email,
    password: hashedPwd,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    verified: false,
  });

  newUser
    .save()
    .then((result) => {
      sendOTPVerificationEmail(result, res)
  })
};




const logInUser = async function (req, res) {
  try{
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if(!existingUser.verified){
      return res.status(400).json({ message: "The user is not verified yet" });
    }

    const matchedPwd = bcrypt.compare(password, existingUser.password);
    if (!matchedPwd) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user =     {
      email: existingUser.email,
      id: existingUser._id
    }
    

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(user);


    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      userId: existingUser._id
    })

    newRefreshToken.save();

    res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
  }
  catch(error){
    res.json({
      status: "Fail",
      "message": error.message
    })
  }
};



const logOutUser = async (req, res) => {
  try{
    const userRecords = await User.findOne({ email: req.body.email });
    await RefreshToken.deleteOne({ userId: userRecords.id  })
    res.json({
      message: "Token deleted"
    })
  }
  catch(error){
    console.log(error)
  }
}

export { fetchSignIn, fetchSignUp, createUser, logInUser, logOutUser };
