import { StatusCodes, ReasonPhrases } from "http-status-codes";

function OK(data){
    return {
        status: StatusCodes.OK,
        data: data
    }
}

function recordNotFound(data){
    return {
        status: StatusCodes.NO_CONTENT,
        data: data
    }
}


function recordCreated(){
    return {
        status: StatusCodes.CREATED,
        message: ReasonPhrases.CREATED
    }
}

function internalServerError(error_msg){
    return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error_msg
    }
}


export {OK, recordNotFound, internalServerError, recordCreated}; 