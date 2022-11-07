import {canUserAccess, canAccessUserOrders} from "../utils/permissions/user.permission.js";

function authenticateUser(req, res, next){
    if(!canUserAccess(req.user, req)){
        res.status(401)
        return res.send("Not allowed")
    }

    next()
}

function authenticateUserOrders(req, res, next){
    if(!canAccessUserOrders(req.user, req)){
        res.status(401)
        return res.send("Not allowed")
    }
    // console.log(canAccessUserOrders(req.user, req))
    next()
}

export { authenticateUser, authenticateUserOrders };