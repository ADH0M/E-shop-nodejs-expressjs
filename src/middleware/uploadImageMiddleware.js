const multer = require('multer');
const path   = require('path');
const ApiError = require('../../utils/apiError');



const upload = ()=>{
    const  memory = multer.memoryStorage();
    const multerFilter = (req,file,cb)=>{
        const fileType = /jpg|jpeg|png/;
        const mimeFile = fileType.test(file.originalname);
        const extName  = fileType.test(path.extname(file.originalname).toLocaleLowerCase());
        
        if(mimeFile && extName){
            return cb(null, true);
        }
        cb(new ApiError('Only images of type PNG, JPEG, and JPG are allowed', 400), false);
    }
    const uploads = multer({
        storage:memory ,
        limits :{fileSize: 5 * 1024 * 1024 },
        fileFilter: multerFilter
    })
    return uploads
}


exports.uploadSingleImage =(key)=>{
    return upload().single(key);
};

exports.uploadMultiyImages =(arrOfKey)=>{
    return upload().fields(arrOfKey);
};


