import Payment from '../models/payment.module.js';
import {StatusCodes} from 'http-status-codes';


// All Payments
const getAllPaymentDetails = async (req, res) => {
    try{
        let filter= {};
        if(req.query.status){
            filter.status = req.query.status.split(",");
        }
        if(req.query.deleteStatus){
            filter.deleteStatus = req.query.deleteStatus.split(",");
        }
        // Payment.find(filter, function(err, payments){
        //     if(err){
        //         throw new Error("Error occured")
        //     }
        //     if(payments.length == 0){
        //         res.sendStatus(StatusCodes.NOT_FOUND)
        //     }
        //     else{
        //         res.status(StatusCodes.OK).json(payments)
        //     }
        // })
        const {page, perPage} = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(perPage) || 10
        }
    
        const paymentDetails = await Payment.paginate(filter, options);
        if(paymentDetails.totalDocs == 0){
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            res.status(StatusCodes.OK).json(paymentDetails)
        }
    }
    catch(error){
        res.json(error)
    }
}

const createPaymentDetail = async (req, res) => {
    try {
        const {userId, orderId} = req.body

        if(Object.keys(req.body).length === 0 || userId === "" || orderId === ""){
            res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
        else{
            const existingPayment = await Payment.findOne({ userId: userId, orderId: orderId });
            if (existingPayment) {
                res.sendStatus(StatusCodes.CONFLICT)
            }
            else{
                const newPaymentDetail = new Payment({
                    userId: req.user.id,
                    status: req.body.status,
                    orderId: orderId,
                    deleteStatus: false
                })
        
                newPaymentDetail.save();
                res.sendStatus(StatusCodes.CREATED)
            }
        }    


    } 
    catch (error) {
        res.json({
            status: "Fail",
            "message": error.message
        })
    }
}


// Specific payment
const getPaymentDetail = async (req, res) => {
    try {
        let filter= {userId: req.params.userId};
        if(req.query.status){
            filter.status = req.query.status.split(",");
        }
        
        const payment = await Payment.find(filter);
        if(payment.length != 0){
            res.status(StatusCodes.OK).json(payment)
        }
        else{
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
    } 
    catch (error) {
        res.json(error)
    }
}

// Specific user and order id
const getPaymentDetailsUserWithOrder = (req, res) => {
    try{
        Payment.findOne({userId: req.params.userId, orderId: req.params.orderId}, function(err, payments){
            if(err){
                throw new Error("Error occured")
            }
            if(payments.length == 0){
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
            else{
                res.status(StatusCodes.OK).json(payments)
            }
        })
    }
    catch(error){
        res.json(error)
    }
}

const updatePaymentDetail = (req, res) => {
    try {
        Payment.findOneAndUpdate({userId: req.params.userId, orderId: req.params.orderId}, {$set: req.body}, function(err, found){
            if (err) {
                throw new Error("Error occured");
              }
              if (found == null) {
                    res.sendStatus(StatusCodes.NOT_FOUND)
              } 
              else {
                    res.sendStatus(StatusCodes.OK)
              }
        });
    } 
    catch (error) {
        res.json(error)
    }
}

const deletePaymentDetail = (req, res) => {
    try {
        Payment.findOneAndUpdate({userId: req.params.userId, orderId: req.params.orderId, deleteStatus: false}, {deleteStatus: true}, function(err, found){
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

export {getAllPaymentDetails, createPaymentDetail, getPaymentDetail, updatePaymentDetail, deletePaymentDetail, getPaymentDetailsUserWithOrder}