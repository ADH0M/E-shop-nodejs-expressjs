const { Router }  = require('express');
const v1Route = Router();
const userRoute = require('./routes/userRoute');
const productRotue = require('./routes/productRoute');
const authRoute =require('./routes/authRoute')
const authenticate = require('../middleware/authMiddleware');



v1Route.use('/v1/products' , productRotue );
v1Route.use('/v1/users' , userRoute );
v1Route.use('/v1/auth'  , authRoute );

module.exports = v1Route;