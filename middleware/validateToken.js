const jwt = require('jsonwebtoken');
const validateToken = (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;;
    if(authHeader){
        token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoder) => {
            if(err){
                res.status(401);
                throw new Error('token unauthorized')
            }

            req.user = decoder.user;
            next();
        })
    }

    if(!token){
        res.status(401);
        throw new Error('Invalid token')
    }
}

module.exports = validateToken;