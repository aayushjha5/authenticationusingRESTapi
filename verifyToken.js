//for session 
const jwt = require("jsonwebtoken");

function verify(req, res, next){
    //take token from request header
    const authHeader = req.headers.token;
    //token validation
    if(authHeader) {
        //take 2nd part in token(of header)
        const token = authHeader.split(" ")[1];

        //verification of token
        jwt.verify(token, process.env.SECRET_KEY,(err,user)=>{
            if(err) res.status(403).json("Invalid Token!");
            //if token matches,
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }


}

module.exports = verify;