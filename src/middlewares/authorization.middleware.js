function authorizeRole(role){
    return (req, res, next) => {
        if(req.user.role !== role){
            res.status(401)
            return res.send("Not allowed")
        }
        next();
    }
}

function authorizeMultipleRoles(roles){
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            res.status(401)
            return res.send("Not allowed")
        }
        // console.log("roles --->",roles)
        next();
    }
}




export { authorizeRole, authorizeMultipleRoles };