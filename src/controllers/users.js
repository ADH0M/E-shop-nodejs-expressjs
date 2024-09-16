const { logger } = require('../helper/logger');
const User = require('../model/users');
const joi = require('joi');
const Redis = require('ioredis');
const {  isValidHash, hashPassword } = require('../helper/hash');
const { authJWT } = require('../helper/authJWT');
const redis = new Redis();



const validation = (req)=>{
    const validationErrors ={};
    const {name , email ,role ,password} = req.body ;
    const {error} = joi.object({
        name:joi.string().required().min(2).max(8),
        email:joi.string().email().required(),
        role:joi.string().required(),
        password:joi.string().required()
    } ).validate( {name , email , role , password } ,{ abortEarly : false } )
    
    if(! error){
        return null;
    }

    error.details.forEach(details => (validationErrors[details.path[0]] = details.message) )
    return validationErrors

}


exports.getAllUsers = async( req , res , next ) => {
    try{
        const Users = await User.findAll();
        res.status(200).json({
            state:'ok',
            data:{Users},
            error:['']
        })
        logger.info('gel all users from database ....')
    }catch(err){
        logger.error(`there is error in get all users the error>>.. ${err}`)
        throw new Error(err)
    }

}


exports.RegisterUsers = async(req,res,next)=>{

    const validate = validation(req);
    res.json({validate})
};


// exports.findUserByPK =async(req,res,next)=>{
//     try{
//         const pk   = req.params.id;
//         const user = await User.findByPk(pk)
      
//         if(user){
//             logger.info('return user by pk////')
//             return res.status(200).json( 
//                 {user:{...user.toJSON() , password:undefined }}
//             )
//         }

//         res.status(500).send('Internal server error....')

//     }catch(err){
//         logger.error(`the server internal ...........${err}`)
//         throw new Error(err)
//     }

// }
// exports.findUserByRole = async( req , res , next ) => {
    
//     try{
//         const role = req.query.role;
//         const user =await User.findAll({attributes:['name','email'], where:{role}})
    
//         if(user){
//             logger.info('return user by role////')
//             return res.status(200).json( 
//                 {user:{...user , password:undefined }}
//             )
//         }

//         res.status(500).send('Internal server error....')

//     }catch(err){
//         logger.error(`the server internal ...........${err}`)
//         throw new Error(err)
//     }

    
    
// };
// exports.updataUser =async(req,res)=>{
//     const reqBody = req.body;
//     const [updataRows]  =await User.update(reqBody.newData ,{where:{id:reqBody.id}});
//     res.json({updataRows});
    
// }



exports.findUserByPK =async ( req , res , next ) => {
    try{ 

        const cachedData = await redis.get('cachedData' );
        if(cachedData){
            return res.send({cachedata:JSON.parse(cachedData)});
        };

        const ID   = req.params.id;
        const user = await User.findByPk(ID)
        
        if( ! user){
            logger.error('the user id is not valiadate....')
            return res.status(401).send('internal server error..')
        }

        await redis.set('cachedData', JSON.stringify({user:{...user.toJSON(),password:undefined}}) ,'EX', 3600);
        logger.info(`the user id validate ....`)
        res.json({
            State:'ok',
            user:{...user.toJSON() , password : undefined },
            error:null
        })

    } catch(err){
        logger.error(err);
        throw new Error(err)
    }

}



exports.login = async ( req , res , next ) => {
    try{ 
        
        const email   = req.body.email;
        const user = await User.findOne({where:{email:email}});

        if( ! user){
            logger.error('the user id is not valiadate....')
            return res.status(401).send('internal server error..')
        };

        let token;
        
        if(true){
            
            token = authJWT({...user.toJSON() })
        }

        console.log(token);
        
        logger.info(`the user id validate ....`);
        res.json({
            State:'ok',
            user:{...user.toJSON() , password : undefined, token },
            error:null
        });

    } catch(err){
        logger.error(err);
        throw new Error(err)
    }

};


exports.userLogin = async(req,res,next)=>{
    try{
        const {email,password } = req.body;
        const data = await User.findOne({where:{email}});
        if(!email){
            return res.status(400).send('no id enter your  id ')        
        }

        if(!data){
            return res.status(400).send('your email is not exist ')        
        }

        if(isValidHash(password , data.password)){
            return res.json({
                state:'succefull regestre',
                data
            })
        }
        
    
        res.status(404).json({
            state:'404',
            err:' password or email is failed '
        })
    }catch(err){

        throw new Error (err)
    }
}


exports.updateUser = async( req , res , next )=>{
    try{
        const id = req.params.id ;
        const {name, option, password , email } = req.body ;

        const isUser = await User.findOne({where:{id}})

        if (!id || !name || !email || !password ) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if(! isUser){
            return res.status(404).send('not found user or user id ..')
        };
            
        if( option == true && isValidHash( password ,isUser.password )){
            return res.status(400).json(
                'this is old password add new password ...'
            )
        }
        
        const hashPass = hashPassword(password)
        await User.update({name,email,password:hashPass},{where:{id}});

        res.json({
            state : 'ok',
            user : isUser
        })

    }catch(err){
        throw new Error (err)
    }
}

exports.updatePassword = async ( req , res , next ) => {
    const  id  = req.params.id;
    const passowrd =req.body.newPassword;
    
    // if( !id || !newPass || !confiramNewPass ){
    //     return res.status(500).json({
    //         state:'500',
    //         data :null ,
    //         error :`there is error enter your id or newpass or confram paas`,
    //     })};

    // if(newPass !== confiramNewPass){
    //     return res.status(500).json({
    //         state:'500',
    //         data :null ,
    //         error :`the new passowrd is not equile confirm password add new password ...`,
    //     })};



    const user = await User.findOne({where:{id}});
    
    if(!user){
        return res.status(404).json({
            state:404 ,
            error:'user id not found'
        })
    };

    let hashPass = user.password ;
    if(hashPass){
        hashPass = hashPassword(passowrd);
    }

    await User.update({password:hashPass},{where:{id}})


    res.status(201).json({
        hashPass,
        state:'succefull ...'
    })
} 