require('dotenv').config();
const jwt = require('jsonwebtoken');
const { logger } = require('../helper/logger');
const authenticate = ( req , res , next ) => {
    
    const authHeader = req.headers.authorization ;
    
        if(!authHeader){
            res.status(401).json('unautorized!');
        };
        try{

            const token   = authHeader.split(' ')[1];
            
            console.log(token ,'++++++++++++++++++++++++++');
            
            const payload = jwt.verify(token , process.env.SCERET_KEY)
            next()

        }catch(err){
            logger.error(`'jwt has error ...'${err}`);
            throw new Error(err);
        }

};

module.exports = authenticate

