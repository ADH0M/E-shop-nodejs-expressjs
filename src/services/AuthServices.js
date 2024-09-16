require('dotenv').config();
const asyncHandler = require('express-async-handler');
const User = require('../model/users');
const  {hashPassword, isValidHash}  = require('../helper/hash');
const jwt  = require('jsonwebtoken');
const { authJWT } = require('../helper/authJWT');
const ApiError = require('../../utils/apiError');

exports.signUp = async (req, res, next ) => {
    try {
        const { name, email, password , passwordCofirm , role } = req.body;

        // Hash the password
        const hashPass = hashPassword(password);        
        // Create new user

        const newUser = await User.create({ name, email,  password: hashPass , role});
        const token = jwt.sign({...newUser.toJSON()} ,process.env.JWT_SCERET_KEY , {
            expiresIn:process.env.JWT_EX
        })

        res.status(201).json({
            state: 'ok',
            user: {...newUser.toJSON() , password:undefined ,passwordUpdate:undefined },
            token:token
        });

    } catch (err) {
        res.status(500).json({ error: `'Server error'${err}` });
    }
};

exports.logIn = asyncHandler ( async (req,res,next)=>{
    const { email , password }= req.body ;
    const user = await User.findOne({where:{email}});
    const passowrdDB = await user.password;
    
    if(!user ||  !( isValidHash ( password , passowrdDB )) ){
        return res.status(404).json({
            state:'error',
            data:{user:null},
            error:'invalid email or password'
        })
    };

    const token = authJWT({userEmail:email ,userId:user.id });

    res.status(200).json({
        state:'ok',
        data:{...user.toJSON(),password:undefined  },
        token
    });

    
});

exports.allowTo =(...role) => {
    return asyncHandler( async ( req , res , next ) => {

        if( !role.includes(req.user.role) ){
            next (new ApiError('you are not allowed to acces this route' , 403 ))
        }
        next()
    })}


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
    const passtime =new Date()
    await User.update({password:hashPass , passwordUpdate:passtime},{where:{id}})
    

    res.status(201).json({
        state:'succefull update the password  ...'
    })
};



