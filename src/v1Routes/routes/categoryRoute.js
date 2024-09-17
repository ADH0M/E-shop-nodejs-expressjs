const { Router } = require('express');
const { createCategory, updateCategory, getAllCategroy, deleteCategory } = require('../../services/categoryServices');
const { createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../../validators/categorieValidators');
const route = Router();


route.get('/',getAllCategroy);
route.post('/createcategory',createCategoryValidator,createCategory);
route.put('/updatecategory',updateCategoryValidator,updateCategory);
route.delete('/deleteone',deleteCategoryValidator,deleteCategory);



module.exports  = route
