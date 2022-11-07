import {StatusCodes} from 'http-status-codes';
import * as status_codes from "../status.codes.js";
import moment from "moment";

const fetchData = async (modelName, filter, options) => {
        const model = await modelName.paginate(filter, options);
        if(!model.totalDocs){
            return status_codes.recordNotFound(model)
        }
        else{
            return status_codes.OK(model)
        }
    }

const createData = async (request, modelName) => {
    const { name, productId } = request.body;
    if (name === "" || productId === "") {
      return status_codes.recordNotFound({message: "Name or product id not entered"})
    }
    const existingProduct = await modelName.findOne({
      productId: productId,
    });
    if (existingProduct) {
        return status_codes.recordNotFound({message: "Product already exists"})
    }
    const newProduct = new modelName({
      name: name,
      productId: productId,
      status: request.body.status,
      category: request.body.category,
      price: request.body.price,
      quantity: request.body.quantity,
      stockQuantity: request.body.stockQuantity,
      productImage: request.body.productImage,
      deleteStatus: false
    });
    newProduct.save();

    return status_codes.recordCreated()
}

const fetchSpecificData = async (modelName, filter) => {
    const foundData = await modelName.findOne(filter);
    if (!foundData) {
        return status_codes.recordNotFound(foundData)
    } 
    else {
        return status_codes.OK(foundData)
    }
}

const updateSpecificData = async (modelName, filter, update) => {
    const foundData = await modelName.findOneAndUpdate(filter, update);
    if (!foundData) {
        return status_codes.recordNotFound(foundData)
    } 
    else {
        return status_codes.OK(foundData)
    }
}

export {fetchData, createData, fetchSpecificData, updateSpecificData};