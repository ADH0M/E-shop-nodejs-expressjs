const Product = require('../model/products');
const { logger } = require('../helper/logger');
const sharp =require('sharp');
const {v4:uuidv4} =require('uuid');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');
const expressAsyncHandler = require('express-async-handler');


exports.productImg = uploadSingleImage('product');

exports.resizeProductImg = expressAsyncHandler ( async ( req , res , next ) => {
    const filename = `prodcut${Date.now()}-${uuidv4()}.jpeg`;

    if(req.file){
        await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:95})
        .toFile(`src/upload/products/${filename}`)
        req.body.uploadImage = filename;
    }
    next()
});




exports.getAllProducts = async (req,res ,next )=>{
    const data = await Product.findAll();
    if(!data){
        logger.error('there is error in gelt all prouducts ......')
        return 0
    }
    logger.info('get all product succesfull ...');
    res.json({
        state:'ok',
        data:{products:data},
        error:null
    })
};

exports.ProductUPload = async (req , res , next ) => {
    try{
        const {filename , path:filepath } = req.file ;
        const { category  , quantity ,product_ID ,productName} = req.body ;
        const thisProduct = await Product.findByPk(product_ID);

        if(thisProduct){
            await Product.update({ filename:filename ,image_path:filepath } ,{ where:{id:product_ID}});
            const data = await Product.findAll();
            logger.warning('the user update image ....')
            return res.status(201).json(data)
        }

        logger.info('product is adding succesfull ....')
        const data = await Product.create({filename,category,image_path:filepath,quantity ,productName})
        res.status(201).json({data ,thisProduct})

    }catch(err){
        throw new Error(err)
    }
}

exports.DeleteProducts =async (req , res , next)=>{
   try{
       const ID = req.params.id ;
       if(!ID) {
           logger.error('to delete product add the product id');
           return res.status(401).send('add the product id ...')};
        logger.warn('product has been deleted . . . ')
       const data = await Product.destroy({where:{id:ID}})
       res.send('product is delete . . ');
   }catch(err){
    logger.error('there are issus in delete product >: ' + err)
    throw new Error (err);
   };

};


