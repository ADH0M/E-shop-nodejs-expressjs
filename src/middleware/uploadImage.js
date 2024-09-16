const multer = require('multer');
const path = require('path');
const { logger } = require('../helper/logger');
const ApiError = require('../../utils/apiError');

const storages = multer.diskStorage({
    destination: ( req , file , cb ) => {
        cb(null, path.join(__dirname ,'../../images'))
    },
    filename:( req , file , cb ) => {
        const fileName = new Date().toISOString().replace(/:/g ,'-') + path.extname(file.originalname);
        
        cb( null , fileName)
    }
});

const uploads = multer({
    storage:storages,
    limits : {fileSize: 5 * 1024 * 1024 }, //5mp
    fileFilter : ( req , file , cb ) => {
        const filesTypes = /png|jpg|jpeg/;
        const mimeFile  = filesTypes.test(file.mimetype);
        const extName   = filesTypes.test(path.extname(__dirname,file.originalname).toLocaleLowerCase());

        console.log(extName ,mimeFile);
        console.log(file.originalname);
        
        if(mimeFile && true ){
            logger.info(`the image is been succesfull insert to server and db `)
            return cb( null ,true ) ;
        }

        logger.error('has error the image type must be png jpg jpeg.....')
        cb(new Error('has error the image type must be png jpg jpeg.....'))
    }
})




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/upload');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

exports.upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req , file , cb) => {
        const fileType = /png|jpeg|jpg/;
        const mimeType = fileType.test(file.mimetype);
        const exName = fileType.test(path.extname(file.originalname).toLowerCase());
        console.log(fileType,mimeType,exName);
        console.log(path.extname(file.originalname));
        
        if (mimeType && exName) {
            return cb(null, true);
        }
        cb(new ApiError('Only images of type PNG, JPEG, and JPG are allowed', 400), false);
    }
});



module.exports = uploads