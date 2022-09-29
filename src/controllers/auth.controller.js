import jwt from "jsonwebtoken";
import RefreshToken from "../models/tokens.module.js";

// To create new access token
const createNewAccessToken = (req, res) => {
  try{
    const refreshToken = req.headers.token; 

    if( refreshToken == null ){
      throw Error("Empty token not allowed")
    }
    else{
      RefreshToken.find({ token: refreshToken }, function(err, foundToken){
        if(err){
          console.log("Error", err)
        }
        if(!foundToken.length){
          res.status(404).json({message: "Refresh Token not found in db"});
        }
        else{
          jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403).json({message: "Error"})
        
            const accessToken = generateAccessToken({ email: user.email, id: user.id })

            res.status(201).json({ accessToken: accessToken })
          })
        }
      });
    }
  }
  catch(error){
    res.json({
      status: "Failed",
      "message": error.message
    })
  }
}


// To generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
}

export { createNewAccessToken, generateAccessToken }