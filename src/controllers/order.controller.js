import Order from "../models/order.module.js";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import ROLES from "../utils/permissions/roles_list.js";
import moment from "moment";
import {
  fetchData,
  createData,
  fetchSpecificData,
  updateSpecificData,
} from "../utils/db_call_functions/order.db.js";
import {
  fetchEndpointData,
  createEndpointData,
  fetchSpecificEndpointData,
  updateSpecificEndpointData,
} from "../utils/end_point/endpoint.utils.js";
import * as status_codes from "../utils/status.codes.js";
import * as filters from "../helper/common/order.filter.js";

const getAllOrders = async (req, res) => {
  try {
    const end_point = "/order-management";
    const { page, perPage } = req.query;
    const options = {
      select:
        "orderId orderStatus orderPlaced total expectedDeliveryDate",
      page: parseInt(page) || 1,
      limit: parseInt(perPage) || 50,
      populate: 'paymentRefId'
    };

    if (process.env.DATASOURCE == "db") {
      console.log("db");
      const foundData = await fetchData(
        Order,
        filters.getAllOrdersFilter(req),
        options
      );
      res.status(foundData.status).json(foundData.data);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await fetchEndpointData(
        req.query,
        "GET",
        `${process.env.BASEURL}${end_point}`,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError(error.message));
  }
};

const createOrder = async (req, res) => {
  try {
    const end_point = "/order-management";

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: "Form validation error",
        errors: errors.array(),
      });
    } else {
      if (process.env.DATASOURCE == "db") {
        console.log("db");
        const data_created = createData(req, Order);
        res.status(data_created.status).json(data_created.message);
        // console.log(data_created)
      } else {
        console.log("ep");
        const token = req.headers.authorization.split(" ")[1];
        const endpoint_data = await createEndpointData(
          "POST",
          process.env.BASEURL + end_point,
          req.body,
          token
        );
        res.json(endpoint_data.data);
      }
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError(error.message));
  }
};

// Specific order by order Id
const getSpecificOrder = async (req, res) => {
  try {
    const end_point = `/order-management/${req.params.orderId}`;

    if (process.env.DATASOURCE === "db") {
      console.log("db");

      // const foundData = await fetchSpecificData(Order, filters.getSpecificOrderFilter(req), 'prodRefId', 'paymentRefId', 'userRefId');
      const foundData = await fetchSpecificData(Order, filters.getSpecificOrderFilter(req), {path: 'products.prodRefId'}, {path: 'paymentRefId'}, {path: 'userRefId', select: 'name phoneNumber email address userId shippingInfo'});

      res.status(foundData.status).json(foundData.data);
    } 
    else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await fetchSpecificEndpointData(
        "GET",
        process.env.BASEURL + end_point,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError());
  }
};

const updateOrder = async (req, res) => {
  try {
    const end_point = `/order-management/${req.params.orderId}`;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: false,
        message: "Form validation error",
        errors: errors.array(),
      });
    } else {
      // Order.findOneAndUpdate(
      //   { orderId: req.params.orderId },
      //   { $set: req.body },
      //   function (err, found) {
      //     if (err) {
      //       throw new Error("Error occured");
      //     }
      //     if (found == null) {
      //       res.sendStatus(StatusCodes.NOT_FOUND);
      //     } else {
      //       res.sendStatus(StatusCodes.OK);
      //     }
      //   }
      // );
      // const foundOrder = await Order.findOneAndUpdate({ orderId: req.params.orderId }, { $set: req.body });

      if (process.env.DATASOURCE === "db") {
        console.log("db");
        const foundOrder = await updateSpecificData(
          Order,
          filters.getSpecificOrderFilter(req),
          { $set: req.body }
        );
        res.status(foundOrder.status).json({ message: "Updated Successfully" });
      } else {
        console.log("ep");
        const token = req.headers.authorization.split(" ")[1];
        const endpoint_data = await updateSpecificEndpointData(
          "PATCH",
          process.env.BASEURL + end_point,
          req.body,
          token
        );
        res.status(endpoint_data.status).json(endpoint_data.data);
      }
    }
  } catch (error) {
    res
      .status(status_codes.internalServerError().status)
      .json(status_codes.internalServerError(error));
    // console.log(error.message)
  }
};

const deleteOrder = async (req, res) => {
  try {
    const end_point = `/order-management/${req.params.orderId}`;
    // Order.findOneAndUpdate(
    //   { orderId: req.params.orderId, deleteStatus: false },
    //   { deleteStatus: true },
    //   function (err) {
    //     if (err) {
    //       throw new Error("Error occured");
    //     } else {
    //       res.sendStatus(StatusCodes.NO_CONTENT);
    //     }
    //   }
    // );
    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const foundOrder = await updateSpecificData(
        Order,
        filters.getSpecificOrderFilter(req),
        { deleteStatus: true }
      );
      res.status(foundOrder.status).json({ message: "Deleted Successfully" });
    } 
    else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await updateSpecificEndpointData(
        "DELETE",
        process.env.BASEURL + end_point,
        { deleteStatus: true },
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    // res.status(404).json({
    //   status: "Failed",
    //   message: error.message,
    // });
    res
    .status(status_codes.internalServerError().status)
    .json(status_codes.internalServerError(error));
  // console.log(error.message)
  }
};

// // Specific orders by user Id
// const getSpecificUserOrders = async (req, res) => {
//   try {
//     let filter = { userId: req.params.userId };
//     if (req.query.orderStatus) {
//       filter.orderStatus = req.query.orderStatus.split(",");
//     }
//     if (req.query.paymentStatus) {
//       filter.paymentStatus = req.query.paymentStatus.split(",");
//     }
//     if (req.query.paymentMethod) {
//       filter.paymentMethod = req.query.paymentMethod.split(",");
//     }
//     if (req.query.shippingMethod) {
//       filter.shippingMethod = req.query.shippingMethod.split(",");
//     }
//     if (req.query.deleteStatus) {
//       filter.deleteStatus = req.query.deleteStatus.split(",");
//     }

//     const { page, perPage } = req.query;
//     const options = {
//       page: parseInt(page) || 1,
//       limit: parseInt(perPage) || 10,
//     };

//     const orders = await Order.paginate(filter, options);
//     if (orders.totalDocs == 0) {
//       res.sendStatus(StatusCodes.NOT_FOUND);
//     } else {
//       res.status(StatusCodes.OK).json(orders);
//     }
//   } catch (error) {
//     res.status(404).json({
//       status: "Failed",
//       message: error.message,
//     });
//   }
// };

export {
  getAllOrders,
  createOrder,
  getSpecificOrder,
  updateOrder,
  deleteOrder,
};