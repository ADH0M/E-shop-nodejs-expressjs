require('dotenv').config();
const jwt = require('jsonwebtoken');
exports.authJWT = (payload) =>{
    return jwt.sign( payload ,process.env.JWT_SCERET_KEY ,{
        expiresIn:process.env.JWT_EX
    })
}

