import express from "express";
import connectDB from "./src/db/connectDB.js";
import * as dotenv from 'dotenv'
import main_router from "./src/routes/main.router.js";



import cors from "cors";


dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
app.use(cors())
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.URL || 'mongodb://localhost:27017';
// const DATABASE_URL = 'mongodb://localhost:27017';


app.use('/public', express.static("public"))


app.use(express.json());


// Database Connection
connectDB(DATABASE_URL);

// // Load routes
app.use("/api", main_router)


app.listen(port, function(){
    console.log("App is running on port " + port);
})