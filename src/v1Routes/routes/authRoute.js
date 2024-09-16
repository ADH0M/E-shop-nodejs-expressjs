const { Router } = require('express') ;
const route = Router();
const { signUp , updatePassword  ,logIn } = require('../../services/AuthServices')
const { singUpValidator , updatePassValidate , logInValidator } =require('../../validators/authValidator')

route.post('/signup' , singUpValidator , signUp );

route.put('/updatapassword/:id' ,updatePassValidate , updatePassword );
route.get('/login', logInValidator  , logIn );

module.exports = route ;