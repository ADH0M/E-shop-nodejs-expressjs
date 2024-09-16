const {check} = require('express-validator');
const slugify = require('slugify');
const User = require('../../src/model/users');
const validatorMiddleware = require('../../src/middleware/validatorMiddleware')
const {isValidHash} =require('../helper/hash')

exports.singUpValidator =[
    check('name')
    .notEmpty()
    .withMessage('user name is require . . .')
    .isLength({min:3})
    .withMessage('user name is too short . . . ')
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true
    }),
    
    check('email')
    .notEmpty()
    .withMessage('email is require . . .')
    .isEmail()
    .withMessage('Invalid Email . . . ')
    .custom((val)=>  User.findOne({where:{email:val}}).then( (user) => {
        if(user){
            return Promise.reject(new Error('E-mail  already in user ...'))
        }
    }
    )),

    check('password')
    .notEmpty()
    .withMessage('password is require ')
    .isLength({min:8}) 
    .withMessage('password is too short ...')
    .custom((val ,{req})=>{
        if(val !== req.body.passwordConfirm){
            throw new Error('password confirmation incorect ...')
        }
        return true
    }), 

    check('passwordConfirm')
    .notEmpty()
    .withMessage("password Confirm required ..."),
    validatorMiddleware
]


exports.updatePassValidate =[
    check('currentPassword')
    .notEmpty()
    .withMessage('current password is require .')
    .isLength({min:8})
    .withMessage('password min liength is 8 charchters .')
    .custom(async ( val , { req } ) => {
        const id   = req.params.id;
        const user = await User.findOne({where:{id}})
        if( !isValidHash(val , user.password) ){
            throw new Error ('incorect password .')
        }
    }),

    check('newPassword')
    .notEmpty()
    .withMessage('new password is require .')
    .isLength({min:8})
    .withMessage('new password min length is 8 charchters .')
    .custom((val ,{req})=>{
        if(val === req.body.currentPassword){
            throw new Error('the currnet password is it same new password add new password.')
        }

        if(val !== req.body.passwordConfirm){
            throw new Error('the confirm password incorect .')
        }
        return true
    } ),

    check('passwordConfirm')
    .notEmpty()
    .withMessage('confirm password is require .')
    ,
    validatorMiddleware
]

exports.logInValidator =[
    check('email')
    .notEmpty()
    .withMessage('email is require . . .')
    .isEmail()
    .withMessage('Invalid Email . . . '),
    
    check('password')
    .notEmpty()
    .withMessage('password is require ')
    .isLength({min:8}) 
    .withMessage('password is too short ...'), 
    validatorMiddleware
]