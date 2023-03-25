// Middleware imports
require('dotenv').config();
const {sign, verify} = require('jsonwebtoken');
//for tokens
function createToken(user) {
    return sign({
        email: user.email,
        userPass: user.userPass
    },
    process.env.SECRET_KEY,
    {
        expiresIn: '30 minutes'
    });
}
//
function verifyAToken(req, res, next) {
    try{
        var token = req.cookies["LegitUser"] !== null ? req.cookies["LegitUser"] :
        "Please sign up" ;
        const isValid = null;
        if(token !== "Please sign up") {
            isValid = verify(token, process.env.SECRET_KEY);
            if(isValid) {
                req.authenticated = true;
                next();
            }else {
                res.status(400).json({err: "Please sign up"})
            }
        }else {
            res.status(400).json({err: "Please sign up"})
        }
    }catch(e) {
        res.status(400).json({err: e.message});
    }
}
module.exports= {createToken, verifyAToken};