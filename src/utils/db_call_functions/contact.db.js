import * as status_codes from "../status.codes.js";


const createData = (request, modelName) => {
    const newData = new modelName(request.body);

    newData.userId = request.user.id;

    newData.save();
    return status_codes.recordCreated()

}

export {createData};