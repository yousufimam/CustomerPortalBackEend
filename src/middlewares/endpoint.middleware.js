function authenticateIdSecret(req, res, next){
    if(process.env.DATASOURCE == "ep"){
        const {clientid, clientsecret} = req.headers;
        console.log("ID SECRET ===>", clientid, clientsecret)

        if(process.env.CLIENTID == clientid && process.env.CLIENTSECRET == clientsecret){
            next()
        }
        else{
            return res.send("Invalid clientId clientSecret")
        }
    }
    else{
        next()
    }
}

export default authenticateIdSecret;
