require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError     = require('../../utils/apiError');
const User = require('../model/users')

// @desc   make sure the user is logged in
const userAuth = asyncHandler( async ( req , res , next )  => {
    const userToken = req.headers.authorization ;
    let token ; 

    if( userToken && userToken.startsWith('Bearer') ){
        token = userToken.split(' ')[1];
    }
    
    if(! token){
        return next(new ApiError('you are unauthorized user ' ,401))
    }

    const decode = jwt.verify( token , process.env.JWT_SCERET_KEY );
    const {userEmail , userId} = decode;

    const currentUser = await User.findOne({where:{email:userEmail ,id:userId}})

    if(!currentUser){
        return next(new ApiError('not fuond user '))    
    };

    
    if(currentUser.passwordUpdate){
        let time = parseInt(currentUser.passwordUpdate.getTime() / 1000 , 10 ) ;
        if(time > decode.iat ){
            return next (new ApiError('not user token is not found ,please login again .'))            
        }
    }


    req.user = currentUser
    console.log(req.user );
    
    next()

})


// @desc    Authorization (User Permissions)
// ["admin", "manager"]

module.exports = userAuth