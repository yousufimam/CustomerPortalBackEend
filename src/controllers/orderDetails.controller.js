import orderDetail from '../models/orderDetails.module.js';
import {StatusCodes} from 'http-status-codes';


// All orders
const getAllOrderDetails = async (req, res) => {
    try{
        // orderDetail.find({deleteStatus: false}, function(err, orders){
        //     if(err){
        //         throw new Error("Error occured")
        //     }
        //     if(orders.length == 0){
        //         res.sendStatus(StatusCodes.NOT_FOUND)
        //     }
        //     else{
        //         res.status(StatusCodes.OK).json(orders)
        //     }
        // })
        const {page, perPage} = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(perPage) || 10
        }
    
        const orderDetails = await orderDetail.paginate({deleteStatus: false}, options);
        if(orderDetails.totalDocs == 0){
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            res.status(StatusCodes.OK).json(orderDetails)
        }
    }
    catch(error){
        res.json(error)
    }
}

const createOrderDetail = async (req, res) => {
    try {
        const {orderId, productId} = req.body

        if(Object.keys(req.body).length === 0 || orderId === "" || productId === ""){
            res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
        else{
            const existingOrder = await orderDetail.findOne({ orderId: orderId, productId: productId });
            if (existingOrder) {
                res.sendStatus(StatusCodes.CONFLICT)
            }
    
            else{
                const newOrderDetail = new orderDetail({
                    orderId: orderId,
                    productId: productId,
                    quantity: req.body.quantity,
                    price: req.body.price,
                    deleteStatus: false
                })
        
                newOrderDetail.save();
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

// Specific order details
const getSpecificOrderDetails = (req, res) => {
    try{
        orderDetail.findOne({orderId: req.params.orderId, deleteStatus: false}, function(err, order){
            if(err){
                throw new Error("Error occured")
            }
            if(order.length == 0){
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
            else{
                res.status(StatusCodes.OK).json(order)
            }
        })
    }
    catch(error){
        res.json(error)
    }
}

const updateSpecificOrderDetails = (req, res) => {
    try {
        orderDetail.findOneAndUpdate({ orderId: req.params.orderId, deleteStatus: false },{ $set: req.body },function (err, found) {
            if (err) {
              throw new Error("Error occured");
            }
            if (found == null) {
                  res.sendStatus(StatusCodes.NOT_FOUND)
            } 
            else {
                  res.sendStatus(StatusCodes.OK)
            }
          }
        );    
    } 
    catch (error) {
        res.json({
            message: error.message,
        });
    }
}

const deleteSpecificOrderDetails = (req, res) => {
    try {
        orderDetail.findOneAndUpdate({orderId: req.params.orderId, deleteStatus: false}, {deleteStatus: true}, function(err){
            if(err){
                throw new Error("Error occured")
            }
            else{
                res.sendStatus(StatusCodes.NO_CONTENT)
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
export {getAllOrderDetails, createOrderDetail, getSpecificOrderDetails, updateSpecificOrderDetails, deleteSpecificOrderDetails}