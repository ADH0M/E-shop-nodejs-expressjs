const slugify = require('slugify');
const {check } = require('express-validator');

const createProductValidator = [
    check('name')
    .notEmpty()
    .withMessage('the product name is require')
    .isLength()
    .withMessage('must be at least 3 chars')
    .custom( (val , { req }) => {
        if(val){
            req.body.slug =slugify(val);
            return true
        }
    }),
    check('category')
    .notEmpty()
    .withMessage('produt must be belong to a category ')
    .isLength({min:3})
    .withMessage('must be at least 3 chars')
    .custom()

]

// category varchar(255) 
// orders varchar(255) 
// imgPath varchar(255) 
// imgName varchar(255) 
// qountity varchar(255) 
// price varchar(255) 
// priceAfterDiscount varchar(255