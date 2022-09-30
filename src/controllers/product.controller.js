import Product from "../models/product.module.js";


// All products
const fetchAllProducts = (req, res) => {
    try{
        Product.find({}, function(err, products){
            if(products.length == 0){
                res.status(404).json({
                    message: "No products found"
                })
            }
            else{
                res.status(200).json(products)
            }
        })
    }
    catch(error){
        res.json(error)
    }
}

const createProduct = async (req, res) => {
    try {
        const {name, productId, productGeneratedId} = req.body

        if (name === "" || productId === "" || productGeneratedId === "") {
            throw new Error("Wrong credentials")
        }    

        const existingProduct = await Product.findOne({ productGeneratedId: productGeneratedId });
        if (existingProduct) {
            throw new Error("Product already exists")
        }

        const newProduct = new Product({
            name: name,
            productId: productId,
            productGeneratedId: productGeneratedId,
            price: req.body.price,
            quantity: req.body.quantity,
            stockQuantity: req.body.stockQuantity
        })

        newProduct.save();
        res.status(201).json({
            status: "Created",
            message: "Product created successfully"
        })

    } 
    catch (error) {
        res.json({
            status: "Fail",
            "message": error.message
        })
    }
}

const deleteAllProducts = (req, res) => {
    try {
        Product.deleteMany({}, function(err){
            if(err){
                throw new Error("Error occured")
            }
            else{
                res.status(200).json({
                    message: "Deleted Successfully",
                })
            }
        });
    } 
    catch (error) {
        res.json({
            message: error.message
        })    
    }
}


// Specific products
const fetchProduct = async (req, res) => {
    try {
        const foundProd  = await Product.findOne({productGeneratedId: req.params.prodGenId})
        if(foundProd === null){
            throw new Error("Product not found")
        }
        else{
            res.status(200).json(foundProd);
        }
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}

const updateProduct = (req, res) => {
    try {
        Product.findOneAndUpdate({productGeneratedId: req.params.prodGenId}, {$set: req.body}, function(err, found){
            if(err){
                throw new Error("Error occured")
            }
            if(found == null){
                res.status(404).json({
                    message: "Product not found"
                })
            }
            else{
                res.status(200).json({
                    message: "Product updated successfully"
                })
            }
        });    
    } 
    catch (error) {
        res.json({
            message: error.message
        })
    }
}

const deleteProduct = (req, res) => {
    try {
        Product.deleteOne({productGeneratedId: req.params.prodGenId}, function(err){
            if(err){
                throw new Error("Error occured")
            }
            else{
                res.status(200).json({ message: "User deleted successfully" });
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

export { fetchAllProducts, createProduct, deleteAllProducts, fetchProduct, updateProduct, deleteProduct };