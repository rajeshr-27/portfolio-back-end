const jwt = require('jsonwebtoken');
const validateRefreshToken = (req,res,next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;;
    if(authHeader){
        token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoder) => {
            if(err){
                res.status(401);
                throw new Error('token unauthorized')
            }

            user = decoder.user;
            const token = jwt.sign({
                    user
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:'10 m'
                })

                const refreshToken = jwt.sign({
                    user
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:'20 m'
                })
                req.user = user;
                req.token = token;
                req.refreshToken = refreshToken;
            next();
        })
    }

    if(!token){
        res.status(401);
        throw new Error('Invalid token')
    }
}

module.exports = validateRefreshToken;