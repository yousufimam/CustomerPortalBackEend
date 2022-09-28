import transporter from "../smtp/transporter.smtp.js";
import UserOTPVerification from "../models/otp.module.js";
import User from "../models/user.module.js";


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

      res.status(201).json({
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
      let { email, otp } = req.body;
  
      if(!email || !otp){
        throw Error("Empty otp details not allowed")
      }

      else{
        const userRecords = await User.find({
          email,
        });

        if(userRecords.length <= 0){
          throw new Error("Account record doesn't exist")
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
            throw new Error("Code has expired. Please request again")
          }
          else{
              if(otp != foundOTP){
                throw new Error("Invalid code passed")
              }
              else{
                await User.updateOne({ email: email }, { verified: true })
                UserOTPVerification.deleteMany({ userId });
                res.status(200).json({
                  "status": "Verified",
                  "message": "Email verified successfully "
                })
              }
          }
        }
        else{
          res.status(200).json({
            "status": "Verified already",
            "message": "Email verified already "
          })
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
      let {email} = req.body;
      if(!email){
        throw Error('Empty details are not allowed')
      }
      else{
        const userRecords = await User.find({
          email,
        });

        if(userRecords.length <= 0){
          throw new Error("Account record doesn't exist")
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
            res.status(200).json({
              status: "Verified",
              message: "Already verified"
            })
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