import User from "../models/user.module.js";
import bcrypt from "bcrypt";

// All users
const fetchAllUsers = (req, res) => {
    try{
        User.find({ verified: true }, function(err, users){
            if(users.length == 0){
                res.status(404).json({
                    message: "No users found"
                })
            }
            else{
                res.status(200).json(users)
            }
        })
    }
    catch(error){
        res.json(error)
    }
}

const deleteAllUsers = (req, res) => {
    User.deleteMany({}, function(err){
        if(err){
            console.log(err)
        }
        res.json({
            "message": "Deleted all users"
        })
    })
}



// Specific users
const fetchSpecificUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.userId);
        if(foundUser === null){
            throw new Error("User not found")
        }
        else{
            res.status(200).json(foundUser);
        }
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}

const updateSpecificUser = async (req, res) => {
    try {
        if(req.body.hasOwnProperty("password")){
            req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALT_ROUNDS));
        }

        const updateUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body});
        if(updateUser == null){
            throw new Error("User not found")
        }
        else{
            res.status(200).json({ 
                message: "User updated successfully"
            });
        }
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}


const deleteSpecificUser  = async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.userId);
        if(deleteUser == null){
            throw new Error("User not found")
        }
        else{
            res.status(200).json({ message: "User deleted successfully" });
        }
        
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}


export { fetchAllUsers, deleteAllUsers, fetchSpecificUser, updateSpecificUser, deleteSpecificUser }