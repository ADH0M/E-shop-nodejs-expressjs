const slugify = require('slugify');
const {check } = require('express-validator');
const validatorMiddleware =require('../middleware/validatorMiddleware');
const { error } = require('winston');
const ApiError = require('../../utils/apiError');

exports.createCategoryValidator = [
    check('name')
    .notEmpty()
    .withMessage('the category name is require')
    .isLength({min:3})
    .withMessage('too short category name must be at least 3 chars')
    .isLength({max:30})
    .withMessage('too long category name must be at least 30 chars')
    .custom( (val , { req }) => {
        if(val){
            req.body.slug = slugify(val);
            return true
        }
    }),
    validatorMiddleware
];

exports.updateCategoryValidator =[
    check('name')
    .notEmpty()
    .withMessage('the category name is require')
    .isLength({min:3})
    .withMessage('too short category name must be at least 3 chars')
    .isLength({max:30})
    .withMessage('too long category name must be at least 30 chars')
    ,

    check('id')
    .notEmpty()
    .withMessage('the category id is require')
    .isNumeric()
    .withMessage('the id must be numeric .')
    .custom((val)=>{
        if(typeof parseInt(val) === 'number'){
            return true
        }else{
            throw new Error('The identifier must be numeric and not alphanumeric')
        }
    }),
    validatorMiddleware

];

exports.deleteCategoryValidator =[
    check('name')
    .notEmpty()
    .withMessage('the category name is require')
    .isLength({min:3})
    .withMessage('too short name the name must be 3 chars')
    ,
    validatorMiddleware
];


