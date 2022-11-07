import ROLES from "../../utils/permissions/roles_list.js";

function getAllOrdersFilter(request) {
  let filter = undefined;
  if (request.user.role == ROLES.Admin) {
    filter = {};
    if (request.query.userId) {
      filter.userId = query.userId.split(",");
    }
  } else if (request.user.role == ROLES.Customer) {
    filter = { userId: request.user.userId }

  }

  if (request.query.orderId) filter.orderId = request.query.orderId.split(",");

  if (request.query.orderStatus)
    filter.orderStatus = request.query.orderStatus.split(",");

  if (request.query.paymentStatus)
    filter.paymentStatus = request.query.paymentStatus.split(",");

  if (request.query.paymentMethod)
    filter.paymentMethod = request.query.paymentMethod.split(",");

  if (request.query.date_placed) {
    const date_range = request.query.date_placed.split("-");
    const start_date = date_range[0];
    const end_date = date_range[1];
    filter.orderPlaced = { $gte: start_date, $lte: end_date };
  }

  console.log(filter)
  return filter;
}

function getSpecificOrderFilter(request) {
  let filter = undefined;

  if (request.user.role === ROLES.Admin) {
    filter = { orderId: request.params.orderId };
  } 
  else if (request.user.role === ROLES.Customer) {
    filter = {
      userId: request.user.userId,
      orderId: request.params.orderId,
    };
  }

  return filter
}
export { getAllOrdersFilter, getSpecificOrderFilter };
