import User from "../models/user.module.js";
import bcrypt from "bcrypt";
import {StatusCodes} from 'http-status-codes';

// All users
const fetchAllUsers = async (req, res) => {
    try{
        const {page, perPage} = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(perPage) || 10
        }
    
        const users = await User.paginate({ verified: true }, options);
        if(users.totalDocs == 0){
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            res.status(StatusCodes.OK).json(users)
        }
    }
    catch(error){
        res.json(error)
    }
}




// Specific users
const fetchSpecificUser = async (req, res) => {
    try {
        const foundUser = await User.findById(req.params.id);
        if(foundUser === null){
            throw new Error("User not found")
        }
        else{
            res.status(StatusCodes.OK).json(foundUser);
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
            // throw new Error("User not found")
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            // res.status(200).json({ 
            //     message: "User updated successfully"
            // });
            res.sendStatus(StatusCodes.OK)
        }
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}


const deleteSpecificUser  = (req, res) => {
    try {
        // const deleteUser = await User.findByIdAndDelete(req.params.userId);
        // if(deleteUser == null){
        //     throw new Error("User not found")
        // }
        // else{
        //     res.status(200).json({ message: "User deleted successfully" });
        // }
        User.findOneAndUpdate({userId: req.params.userId, deleteStatus: false}, {deleteStatus: true}, function(err, found){
            if(err){
                throw new Error("Error occured")
            }
            if(found == null){
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
            else{
                res.sendStatus(StatusCodes.OK)
            }
        });
        
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}


export { fetchAllUsers, fetchSpecificUser, updateSpecificUser, deleteSpecificUser }