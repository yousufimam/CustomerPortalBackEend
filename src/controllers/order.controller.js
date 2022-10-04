import Order from "../models/order.module.js";
import {StatusCodes} from 'http-status-codes';


// All orders
// const getAllOrders = (req, res) => {
//     try{
//         let filter= {};
//         if(req.query.orderStatus){
//             filter.orderStatus = req.query.orderStatus.split(",");
//         }
//         if(req.query.paymentStatus){
//             filter.paymentStatus = req.query.paymentStatus.split(",");
//         }
//         if(req.query.paymentMethod){
//             filter.paymentMethod = req.query.paymentMethod.split(",");
//         }
//         if(req.query.shippingMethod){
//             filter.shippingMethod = req.query.shippingMethod.split(",");
//         }
//         if(req.query.deleteStatus){
//             filter.deleteStatus = req.query.deleteStatus.split(",");
//         } 

//         Order.find(filter, function(err, orders){
//             if(err){
//                 throw new Error("Error occured")
//             }
//             if(orders.length == 0){
//                 res.sendStatus(StatusCodes.NOT_FOUND)
//             }
//             else{
//                 res.status(StatusCodes.OK).json(orders)
//             }
//         })
//     }
//     catch(error){
//         res.json(error)
//     }
// }


const getAllOrders = async (req, res) => {
        try{
        let filter= {};
        if(req.query.orderStatus){
            filter.orderStatus = req.query.orderStatus.split(",");
        }
        if(req.query.paymentStatus){
            filter.paymentStatus = req.query.paymentStatus.split(",");
        }
        if(req.query.paymentMethod){
            filter.paymentMethod = req.query.paymentMethod.split(",");
        }
        if(req.query.shippingMethod){
            filter.shippingMethod = req.query.shippingMethod.split(",");
        }
        if(req.query.deleteStatus){
            filter.deleteStatus = req.query.deleteStatus.split(",");
        }
        
    const {page, perPage} = req.query;
    const options = {
        page: parseInt(page) || 1,
        limit: parseInt(perPage) || 10
    }

    const orders = await Order.paginate(filter, options);
    if(orders.totalDocs == 0){
        res.sendStatus(StatusCodes.NOT_FOUND)
    }
    else{
        res.status(StatusCodes.OK).json(orders)
    }


    }
    catch(error){
        console.log("Err", error)
        res.json(error)
    }
}

const createOrder = async (req, res) => {
    try {
        const {orderId, userId} = req.body

        if (orderId === "" || userId === "") {
            res.sendStatus(StatusCodes.UNAUTHORIZED)
        }
        else{
            const existingOrder = await Order.findOne({ orderId: orderId });
            if (existingOrder) {
                res.sendStatus(StatusCodes.CONFLICT)
            }
            else{
                const newOrder = new Order({
                    orderId: orderId,
                    userId: req.user.id,
                    orderStatus: req.body.orderStatus,
                    total: req.body.total,
                    paymentStatus: req.body.paymentStatus,
                    paymentMethod: req.body.paymentMethod,
                    shippingMethod: req.body.shippingMethod,
                    deleteStatus: false,
                    paymentId: req.body.paymentId,
                    deliveryDate: Date.now() + 30000
                })
                newOrder.save();
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



// Specific order by order Id
const getSpecificOrder = async (req, res) => {
    try {
        const foundOrder  = await Order.findOne({orderId: req.params.orderId})
        if(foundOrder === null){
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            res.status(StatusCodes.OK).json(foundOrder)
        }
    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}

const updateOrder = (req, res) => {
    try {
      Order.findOneAndUpdate({ orderId: req.params.orderId, deleteStatus: false },{ $set: req.body },function (err, found) {
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
  };
  

const deleteOrder = (req, res) => {
    try {
        Order.findOneAndUpdate({orderId: req.params.orderId, deleteStatus: false}, {deleteStatus: true}, function(err){
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

// Specific orders by user Id
const getSpecificUserOrders = async (req, res) => {
    try {
        let filter= {userId: req.params.userId};
        if(req.query.orderStatus){
            filter.orderStatus = req.query.orderStatus.split(",");
        }
        if(req.query.paymentStatus){
            filter.paymentStatus = req.query.paymentStatus.split(",");
        }
        if(req.query.paymentMethod){
            filter.paymentMethod = req.query.paymentMethod.split(",");
        }
        if(req.query.shippingMethod){
            filter.shippingMethod = req.query.shippingMethod.split(",");
        }
        if(req.query.deleteStatus){
            filter.deleteStatus = req.query.deleteStatus.split(",");
        }

        const {page, perPage} = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(perPage) || 10
        }
    
        const orders = await Order.paginate(filter, options);
        if(orders.totalDocs == 0){
            res.sendStatus(StatusCodes.NOT_FOUND)
        }
        else{
            res.status(StatusCodes.OK).json(orders)
        }

    } 
    catch (error) {
        res.status(404).json({ 
            status: "Failed",
            message: error.message 
        });
    }
}


export {getAllOrders, createOrder, getSpecificOrder, updateOrder, deleteOrder, getSpecificUserOrders};