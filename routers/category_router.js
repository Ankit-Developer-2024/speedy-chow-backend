const express = require('express')
const router = express.Router()
const {createCategory,fetchAllCategory, deleteCategory} = require('../controllers/category_controller') 
const upload= require('../config/multer_config') 

exports.router=
      router.post('/',upload.single("image"),createCategory)
            .get('/',fetchAllCategory)
            .delete('/:id',deleteCategory)