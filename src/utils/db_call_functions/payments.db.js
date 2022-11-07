import {StatusCodes} from 'http-status-codes';
import * as status_codes from "../status.codes.js";
import moment from "moment";
import Order from '../../models/order.module.js';

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

    const newPaymentDetail = new modelName({
        userRefId: request.user.id,
        userId: request.user.userId,
        status: "unpaid",
        method: request.body.method,
        orderRefId: request.body.orderRefId,
        deleteStatus: false,
        paymentDate: new Date().setDate(new Date().getDate() + 10),
    })

    newPaymentDetail.save();
    await Order.findByIdAndUpdate({_id: request.body.orderRefId}, {paymentRefId: newPaymentDetail._id})
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