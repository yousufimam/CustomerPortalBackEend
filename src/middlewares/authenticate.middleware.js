import jwt from "jsonwebtoken";


function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user){
        if(err) return res.status(403).json({
            message: "Error",
            description: "Token expired or invalid"
        })
        
        req.user = user;
        console.log("REQ ===>", req.user)
        next();
    })
}

export default authenticateToken;
