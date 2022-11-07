import ROLES from "../../utils/permissions/roles_list.js";

function getAllPaymentsFilter(request) {
    let filter = undefined;
    if(request.user.role == ROLES.Admin){
        filter = {}
        if(request.query.userId){
            filter.userId = request.query.userId.split(",");
        }
    }
    else if(request.user.role == ROLES.Customer){
        filter = {userId: request.user.userId}
    }


    if(request.query.status){
        filter.status = request.query.status.split(",");
    }

    if(request.query.paymentId){
        filter.paymentId = request.query.paymentId.split(",")
    }

    if (request.query.transaction_date) {
        const date_range = request.query.transaction_date.split("-");
        const start_date = date_range[0];
        const end_date = date_range[1];
        filter.paymentDate = { $gte: start_date, $lte: end_date };
    }

    if(request.query.orderId) {
        filter.orderRefId.orderId = request.query.orderId
    }
  return filter;
}

function getSpecificPaymentFilter(request) {
    let filter= undefined;
    if(request.user.role == ROLES.Admin){
        filter = {paymentId: request.params.paymentId}
    }
    else if(request.user.role == ROLES.Customer){
        filter = {userRefId: request.user.id, paymentId: request.params.paymentId}
    }
  return filter
}
export { getAllPaymentsFilter, getSpecificPaymentFilter };
