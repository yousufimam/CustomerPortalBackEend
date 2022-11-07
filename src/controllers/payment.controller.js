import Payment from "../models/payment.module.js";
import { StatusCodes } from "http-status-codes";
import ROLES from "../utils/permissions/roles_list.js";
import moment from "moment/moment.js";
import {
  getAllPaymentsFilter,
  getSpecificPaymentFilter,
} from "../helper/common/payment.filter.js";
import {
  fetchData,
  createData,
  fetchSpecificData,
  updateSpecificData,
} from "../utils/db_call_functions/payments.db.js";
import {
  fetchEndpointData,
  createEndpointData,
  fetchSpecificEndpointData,
  updateSpecificEndpointData,
} from "../utils/end_point/endpoint.utils.js";

// All Payments
const getAllPaymentDetails = async (req, res) => {
  try {
    const end_point = "/paymentDetails";
    const { page, perPage } = req.query;
    const options = {
      // ** For getting whole doc **
      // populate: 'orderRefId',

      // ** For getting specific fields from doc **
      populate: {
        path: "orderRefId",
        select: "total orderId",
        //
        // match: { orderId: {$exists: true, $eq: req.query.orderId}}
        //
      },
      select: "paymentId status paymentDate userId",
      page: parseInt(page) || 1,
      limit: parseInt(perPage) || 10,
    };
    if (process.env.DATASOURCE === "db") {
      console.log("db");

      const paymentDetails = await fetchData(
        Payment,
        getAllPaymentsFilter(req),
        // {'orderRefId.orderId': "OID34"},
        options
      );

      console.log(paymentDetails)
      res.status(paymentDetails.status).json(paymentDetails.data);
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
    res.json(error);
  }
};

const createPaymentDetail = async (req, res) => {
  try {
    const end_point = "/paymentDetails";
    if (process.env.DATASOURCE === "db") {
      console.log("db");
      const data_created = await createData(req, Payment);
      res.status(data_created.status).json(data_created.message);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await createEndpointData(
        "POST",
        process.env.BASEURL + end_point,
        req.body,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res.json({
      status: "Fail",
      message: error.message,
    });
  }
};

// Specific payment
const getPaymentDetail = async (req, res) => {
  try {
    let filter = { userId: req.params.userId };
    if (req.query.status) {
      filter.status = req.query.status.split(",");
    }

    const payment = await Payment.find(filter);
    if (payment.length != 0) {
      res.status(StatusCodes.OK).json(payment);
    } else {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
  } catch (error) {
    res.json(error);
  }
};

// Specific user and order id
const getPaymentDetailsUserWithOrder = (req, res) => {
  try {
    Payment.findOne(
      { userId: req.params.userId, orderId: req.params.orderId },
      function (err, payments) {
        if (err) {
          throw new Error("Error occured");
        }
        if (payments.length == 0) {
          res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
          res.status(StatusCodes.OK).json(payments);
        }
      }
    );
  } catch (error) {
    res.json(error);
  }
};

const updatePaymentDetail = (req, res) => {
  try {
    Payment.findOneAndUpdate(
      { userId: req.params.userId, orderId: req.params.orderId },
      { $set: req.body },
      function (err, found) {
        if (err) {
          throw new Error("Error occured");
        }
        if (found == null) {
          res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
          res.sendStatus(StatusCodes.OK);
        }
      }
    );
  } catch (error) {
    res.json(error);
  }
};

const deletePaymentDetail = (req, res) => {
  try {
    Payment.findOneAndUpdate(
      {
        userId: req.params.userId,
        orderId: req.params.orderId,
        deleteStatus: false,
      },
      { deleteStatus: true },
      function (err, found) {
        if (err) {
          throw new Error("Error occured");
        }
        if (found == null) {
          res.sendStatus(StatusCodes.NOT_FOUND);
        } else {
          res.sendStatus(StatusCodes.OK);
        }
      }
    );
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

//

const getPaymentDetailWithId = async (req, res) => {
  try {
    const end_point = `/paymentDetails/${req.params.paymentId}`;
    if (process.env.DATASOURCE === "db") {
      console.log("db");

      const foundData = await fetchSpecificData(
        Payment,
        getSpecificPaymentFilter(req)
      );
      res.status(foundData.status).json(foundData.data);
    } else {
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
    res.json(error);
  }
};

const updatePaymentDetailWithId = async (req, res) => {
  try {
    const end_point = `/paymentDetails/${req.params.paymentId}`;
    if (process.env.DATASOURCE === "db") {
      console.log("db");

      const foundData = await updateSpecificData(
        Payment,
        getSpecificPaymentFilter(req),
        { $set: req.body }
      );
      res.status(foundData.status).json(foundData.data);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await updateSpecificEndpointData(
        "GET",
        process.env.BASEURL + end_point,
        req.body,
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res.json(error);
  }
};

const deletePaymentDetailWithId = async (req, res) => {
  try {
    const end_point = `/paymentDetails/${req.params.paymentId}`;
    if (process.env.DATASOURCE === "db") {
      console.log("db");

      const foundData = await updateSpecificData(
        Payment,
        getSpecificPaymentFilter(req),
        { deleteStatus: true }
      );
      res.status(foundData.status).json(foundData.data);
    } else {
      console.log("ep");
      const token = req.headers.authorization.split(" ")[1];
      const endpoint_data = await updateSpecificEndpointData(
        "GET",
        process.env.BASEURL + end_point,
        { deleteStatus: true },
        token
      );
      res.status(endpoint_data.status).json(endpoint_data.data);
    }
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error.message,
    });
  }
};

export {
  getAllPaymentDetails,
  createPaymentDetail,
  getPaymentDetail,
  updatePaymentDetail,
  deletePaymentDetail,
  getPaymentDetailsUserWithOrder,
  getPaymentDetailWithId,
  updatePaymentDetailWithId,
  deletePaymentDetailWithId,
};
