import express from "express";
import connectDB from "./src/db/connectDB.js";
import web from "./src/routes/user.route.js";
import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express();
const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.port || 'mongodb://localhost:27017';


app.use(express.json());

// Database Connection
connectDB(DATABASE_URL);


// Load routes
app.use('/', web)


app.listen(port, function(){
    console.log(`Server running on port ${port}`)
})