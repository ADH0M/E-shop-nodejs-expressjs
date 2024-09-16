require('dotenv').config();
const asyncHandler = require('express-async-handler');
const sharp        = require('sharp');
const {v4:uuidv4}  =require('uuid')
const User = require("../model/users");

const {getONe, getAll} = require('../controllers/handlersfactory');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');



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

exports.UploadUserImage = uploadSingleImage('profileImg');
exports.resizeImage     = asyncHandler( async ( req , res , next ) =>{
    const fileName  =`${Date.now() }-${ uuidv4() }.jpeg`;
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:95})
        .toFile(`src/upload/users/${fileName}`)
        req.body.uploadImage =fileName;
    }
    next()
})

exports.getUser     = getONe(User);
exports.getAllUsers = getAll(User);
