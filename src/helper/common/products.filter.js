import ROLES from "../../utils/permissions/roles_list.js";

function getAllProductsFilter (request){
    let filter = {};
    
    if(request.query.name){
      filter.name = request.query.name.split(",");
    }
    
    if(request.query.status){
      filter.status = request.query.status.split(",");
    }
    
    if(request.query.price){
      const price_range = request.query.price.split("_");
        const start_price = price_range[0];
        const end_price = price_range[2];
        filter.price = { $gte: start_price, $lte: end_price};
    }
    
    if(request.query.productId){
        filter.productGenId = request.query.productId.split(",");
    }

    return filter;
}


export {getAllProductsFilter};