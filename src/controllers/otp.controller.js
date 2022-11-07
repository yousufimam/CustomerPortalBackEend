import transporter from "../smtp/transporter.smtp.js";
import UserOTPVerification from "../models/otp.module.js";
import User from "../models/user.module.js";
import {StatusCodes} from 'http-status-codes';
import { validationResult } from "express-validator";

// To send otp

const sendOTPVerificationEmail = async (result, res) => {
    try{
      let { email, _id } = result;
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your mail",
        html: `<p> Enter ${otp} </p>`
      };
  
      const newOTPVerification = new UserOTPVerification({
        userId: _id,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30000
      });
  
      newOTPVerification.save();
  
      await transporter.sendMail(mailOptions);

      res.status(StatusCodes.CREATED).json({
        status: "PENDING",
        message: "Verification otp email sent",
        data: {
          email,
          _id
        }
      })
    }
    catch(error){
      res.json({
        status: "Failed",
        message: error.message
      })
    }
  }


// Verify OTP
const verifyOTP = async (req, res) => {
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
        let { email, otp } = req.body;
  
        if(!email || !otp){
          throw Error("Empty otp details not allowed")
        }
  
        else{
          const userRecords = await User.find({
            email,
          });
  
          if(userRecords.length <= 0){
            // throw new Error("Account record doesn't exist")
            res.sendStatus(StatusCodes.NOT_FOUND)
          }
          else{
          const isVerifiedUser = userRecords[0].verified;
  
          if(!isVerifiedUser){
            const userId = userRecords[0].id;
  
            const userOTPRecords = await UserOTPVerification.find({ userId: userId });
            const foundOTP = userOTPRecords[0].otp;
  
            const { expiresAt } = userOTPRecords[0];
    
            if(expiresAt < Date.now()){
              UserOTPVerification.deleteMany({ userId });
              // throw new Error("Code has expired. Please request again")
              res.sendStatus(StatusCodes.UNAUTHORIZED)
            }
            else{
                if(otp != foundOTP){
                  // throw new Error("Invalid code passed")
                  res.sendStatus(StatusCodes.UNAUTHORIZED)
                }
                else{
                  await User.updateOne({ email: email }, { verified: true })
                  UserOTPVerification.deleteMany({ userId });
                  res.status(StatusCodes.OK).json({
                    "status": "Verified",
                    "message": "Email verified successfully "
                  })
                }
            }
          }
          else{
            res.status(StatusCodes.OK).json({
              "status": "Verified already",
              "message": "Email verified already "
            })
          }
          }
        }
      }

    }
    catch(error){
      res.json({
        status: "Failed",
        "message": error.message
      })
    }
  }
  
  
  
  // Resend OTP code
  const resendOTPVerification = async (req, res) => {
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
        let {email} = req.body;
        if(!email){
          res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
        else{
          const userRecords = await User.find({
            email,
          });
  
          if(userRecords.length <= 0){
            res.sendStatus(StatusCodes.NOT_FOUND)
          }
          else{
            const isVerified = userRecords[0].verified;
            if(!isVerified){
              
              const userId = userRecords[0].id;
  
              await UserOTPVerification.deleteMany({ userId });
              const result = {
                email: email,
                _id: userId
              }
              sendOTPVerificationEmail(result, res);
            }
            else{
              res.status(StatusCodes.OK).json({
                status: "Verified",
                message: "Already verified"
              })
            }
  
        }
      }
      }
  }
    catch(error){
      res.json({
        status: "Failed",
        message: error.message
      })
    }
  }


export { sendOTPVerificationEmail, verifyOTP, resendOTPVerification }