import express from "express";
import connectDB from "./src/db/connectDB.js";
import * as dotenv from 'dotenv'

import global from "./src/routes/global.route.js";
import user from "./src/routes/user.route.js";
import product from "./src/routes/product.route.js";

import authenticateToken from "./src/middlewares/authenticate.middleware.js"

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
const app = express();
const port = process.env.PORT || '3000';
const DATABASE_URL = process.env.port || 'mongodb://localhost:27017';


app.use(express.json());

// Database Connection
connectDB(DATABASE_URL);


// Load routes
app.use('/', global)
app.use('/users', user)

app.use("/products", authenticateToken, product)

app.listen(port, function(){
    console.log(`Server running on port ${port}`)
})