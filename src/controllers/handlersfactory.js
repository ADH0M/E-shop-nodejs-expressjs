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

            logger.info(`return all `);
            const filteredData = data.map(user => {
                const { password , createdAt , updatedAt , ...rest } = user.dataValues;
                return rest;
            });

            res.status(200).json({data : filteredData });
        }catch(err){
            logger.error(`there is error in getall user ${err}`)
            new ApiError(err , 500)
        }

    })
}

exports.createOne = (Model) => 
    asyncHandler( async ( req , res , next ) => {
        const newDoc = await Model.create({...req.body});
    });


exports.deleteOne =(Model)=>
    asyncHandler( async ( req , res , next) => {
        try{
            const {name} = req.body;
        const data = await Model.findOne({where:{name:name}});
        if(!data){
            return next(new ApiError('Not found in database .',404))
        }
        
        await Model.destroy({where:{name:name}});
        logger.warn('delete item succeful.');
        res.status(200).json({
            state:'warring',
            data:null,
            message:'item delete succefully'
        })

        }catch(err){
            logger.error(err);
            next( new Error(err));
        }
    })
