const { default: slugify } = require("slugify");
const ApiError = require("../../utils/apiError");
const Category = require("../model/category");
const asyncHandler =require('express-async-handler');
const { logger } = require("../helper/logger");
const { getAll, deleteOne } = require("../controllers/handlersfactory");

exports.getAllCategroy = getAll(Category);

exports.createCategory =async (req, res, next) => {
    try {
        const { slug, name } = req.body;
        const categorySearch = await Category.findOne({ where: { name: name } });
        console.log(categorySearch);
        if (categorySearch) {
            return next(new ApiError('Category already exists', 400));
        }
        const category = await Category.create({ name, slug });
        res.status(201).json({ category });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = asyncHandler(async (req,res,next)=>{
    try{
        const { id , name } = req.body;
        const slug = slugify(name);
        const idSearch = await Category.findOne({where:{id}});

        if(!idSearch){
            return res.status(404).json({
                state:'error',
                data:null,
                error:'not found id in database.'
            });
        };

        const [category] = await Category.update({name , slug } , { where:{id:id} })
        res.status(200).json({
            category
        })
        logger.info(`update categroy id that id:${id} to new name ${name}`)
    }catch(err){
        logger.error('an error on update category ', err);
        throw new Error(err)
    }

})

exports.deleteCategory = deleteOne(Category);

