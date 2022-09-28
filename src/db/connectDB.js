import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            dbName: 'userDB'
        }

        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected successfully")
    }
    catch(err){
        console.log("Connection Error ===>",err)
    }
}

export default connectDB;