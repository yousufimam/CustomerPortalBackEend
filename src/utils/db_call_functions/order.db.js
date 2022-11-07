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

const createData = (request, modelName) => {
    // const newData = new modelName({
    //     userRefId: request.user.id,
    //     userId: request.user.userId,
    //     orderStatus: request.body.orderStatus,
    //     total: request.body.total,
    //     // paymentStatus: request.body.paymentStatus,
    //     // paymentMethod: request.body.paymentMethod,
    //     shippingMethod: request.body.shippingMethod,
    //     deleteStatus: false,
    //     expectedDeliveryDate: new Date().setDate(new Date().getDate() + 10),
    //     orderPlaced: new Date(),
    //     // prodRefId: request.body.prodRefId
    //     products: [{
    //         quantity: request.body.quantity,
    //         unit_price: request.body.unit_price,
    //         prodRefId: request.body.prodRefId
    //       }]
    //   });
    //   newData.save();

    const newData = new modelName(request.body);
    newData.userRefId = request.user.id
    newData.userId = request.user.userId
    newData.deleteStatus = false
    newData.expectedDeliveryDate = new Date().setDate(new Date().getDate() + 10)
    newData.orderPlaced = new Date()
    // newData.total = newData.products.length

    newData.save();
    return status_codes.recordCreated()
    // return newData
}

const fetchSpecificData = async (modelName, filter, populatePath1, populatePath2, populatePath3) => {
    const foundData = await modelName.findOne(filter).populate(populatePath1).populate(populatePath2).populate(populatePath3);
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