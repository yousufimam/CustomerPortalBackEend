import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../smtp/transporter.smtp.js";

import User from "../models/user.module.js";
import RefreshToken from "../models/tokens.module.js";

import {sendOTPVerificationEmail} from "./otp.controller.js";
import { generateAccessToken } from "./auth.controller.js";
import {StatusCodes} from 'http-status-codes';
import { validationResult } from "express-validator";
import ROLES from "../utils/permissions/roles_list.js";
// GET controllers

const welcomeRoute = (req, res) => {
  return res.status(StatusCodes.OK).send("App deployed successfully")
}

const fetchSignUp = (req, res) => {
  return res.sendStatus(StatusCodes.OK);
};

const fetchSignIn = (req, res) => {
  return res.sendStatus(StatusCodes.OK)
};







  const createUser = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: "Form validation error",
        errors: errors.array()
      })
    }

    else{
      const { name, email, password, phoneNumber, address, role, courier, trackingNumber } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.sendStatus(StatusCodes.CONFLICT)
      }
  

      const hashedPwd = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPwd,
        phoneNumber: phoneNumber,
        address: address,
        verified: false,
        deleteStatus: false,
        role: ROLES.Customer,
        shippingInfo: {
          courier: courier,
          trackingNumber: trackingNumber,
          address: address
        }
      });
    
      newUser
        .save()
        .then((result) => {
          sendOTPVerificationEmail(result, res)
      })
    }
  };



const logInUser = async function (req, res) {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: "Form validation error",
        errors: errors.array()
      })
    }
    else{
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email: email });
  
      if (!existingUser) {
        return res.sendStatus(StatusCodes.NOT_FOUND)
      }
  
      if(!existingUser.verified){
        return res.sendStatus(StatusCodes.UNAUTHORIZED)
      }
  
      const matchedPwd = await bcrypt.compare(password, existingUser.password);
      if (!matchedPwd) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED)
      }


  
      const user =     {
        email: existingUser.email,
        userId: existingUser.userId,
        id: existingUser._id,
        role: existingUser.role
      }
      
  
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      const accessToken = generateAccessToken(user);
  
  
      const newRefreshToken = new RefreshToken({
        token: refreshToken,
        userId: existingUser._id
      })
  
      newRefreshToken.save();
  
      res.status(StatusCodes.OK).json({ accessToken: accessToken, refreshToken: refreshToken });
    }
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
    res.status(StatusCodes.OK).json({
      message: "Token deleted"
    })
  }
  catch(error){
    console.log(error)
  }
}



const getForgotPassword = (req, res) => {
  res.send("Go to forgot pwd post route")
}


const postForgotPassword = async (req, res) => {
  const {email} = req.body;
  const foundUser = await User.findOne({email});
  if(foundUser !== null){
    console.log("Foud")

    // User exists and create a one time link
    const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;
    const payload = {
      email: foundUser.email,
      userId: foundUser.userId
    }

    const url = req.protocol + '://' + req.get('host');
    const token = jwt.sign(payload, secret, {expiresIn: '15m'});
    const link = `${url}/reset-password/${foundUser.userId}/${token}`
    console.log(link)


    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Forgot password email",
      html: `<p> Verify your mail by clicking on this link ${link} </p>`
    };
    await transporter.sendMail(mailOptions);
    // 
    res.send("PWD sent link has been sent to email")
  }
  else{
    res.status(StatusCodes.UNAUTHORIZED).json({
      "message": "User is not registered"
    })
    return;
  }
}


const getResetPassword = async (req, res) => {
  const {userId, token} = req.params;
  const foundUser = await User.findOne({userId});

  if(foundUser == null){
    res.send("Invalid id")
    return;
  }
  const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;
  try {
    const payload = jwt.verify(token, secret);
    console.log("GET payload =====>", payload)
    res.json({
      email: foundUser.email,
      message: "Enter your new pwd in reset pwd post route"
    })
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

const postResetPassword = async (req, res) => {
  const {userId, token} = req.params;
  const {password} = req.body;
  const foundUser = await User.findOne({userId});

  if(foundUser == null){
    res.send("Invalid id")
    return;
  }
  const secret = process.env.ACCESS_TOKEN_SECRET + foundUser.password;
  try {
    const payload = jwt.verify(token, secret);
    const hashedPwd = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    const updatedUser = await User.findOneAndUpdate({userId}, { password: hashedPwd })

    res.send(updatedUser)
  } catch (error) {
    console.log(error)
    res.send(error.message)
  }
}

export { fetchSignIn, fetchSignUp, createUser, logInUser, logOutUser, welcomeRoute, getForgotPassword, postForgotPassword, getResetPassword, postResetPassword };


