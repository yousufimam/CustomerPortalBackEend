import ROLES from "./roles_list.js"

function canUserAccess(user, query){
    return (
        user.role === ROLES.Admin || user.id === query.params.id
        )
}

function canAccessUserOrders(user, query){
    return (
        user.role === ROLES.Admin || user.userId === query.params.userId
        )
}


export { canUserAccess, canAccessUserOrders }