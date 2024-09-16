const { Router }  = require('express');
const { findUserByPK } = require('../../controllers/users');
const { getUser ,getAllUsers } = require('../../services/userServices');
const userAuth = require('../../middleware/userAuthenticate');
const { allowTo } = require('../../services/AuthServices');


const route = Router();



//login 
// route.get('/v/userUpdata/:id' , updateUser );

// route.get('/:id' , authenticate,findUserByPK )




// user routes  ;
route.use(userAuth);
route.use(allowTo('admin' ,'cunsumer'));
route.get('/' , getAllUsers);
route.get('/user/:id' ,findUserByPK )
route.get('/:id', getUser);



module.exports = route