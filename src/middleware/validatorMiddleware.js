const { validationResult } = require('express-validator');

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = ( req , res , next ) => {
  const result = validationResult(req);
  if(!result.isEmpty()){
    return res.status(400).json({
      result: result.array()
    });
  };

  next();
};

module.exports = validatorMiddleware;
