const asyncHandler = require('express-async-handler');
const ApiError = require('../../utils/apiError');
const { logger } = require('../helper/logger');

exports.getONe = (Model) => {
    try{
        return asyncHandler( async ( req , res , next ) => {
            const {id} = req.params;
            const User = await Model.findByPk(id);
            if(! User ){
                // res.status(404).send(new ApiError(`'user id :${id} is not define ...` , 404))
                return next(new ApiError(`'user id :${id} is not define ...` , 404))
            }
            logger.info(`user id ${id } is regester `)
            res.status(200).json( { data:User })
        })
    }catch(err){
        logger.error('an error in getone user '+err);
        new ApiError(err , 500)
    }
}

exports.getAll = (Model) =>{
    return asyncHandler( async( req , res , next ) => {
        try{
            const data = await Model.findAll();
            if( !data ) {
                res.status(404).send(new ApiError('not foune user ',404))
                return next(new ApiError('not found users ',404 ))
            }

            logger.info(`return all users`);
            const filteredData = data.map(user => {
                const { password, ...rest } = user.dataValues;
                return rest;
            });

            res.status(200).json({data : filteredData });
        }catch(err){
            logger.error(`there is error in getall user ${err}`)
            new ApiError(err , 500)
        }

    })
}

// exports.createOne = ( Model ) => {
//     return asyncHandler( async ( req , res , next ) => {
//         const {}
//     })
// }
