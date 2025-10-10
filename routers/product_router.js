const express = require('express')
const router = express.Router()
const {createProduct,fetchAllProduct,fetchProductById,updateProduct, deleteProductById, searchProductByName} = require('../controllers/product_controller')
const upload= require('../config/multer_config') 

router.post('/',upload.single("image"),createProduct)
      .get('/',fetchAllProduct)
      .get('/search',searchProductByName)
      .get('/:id',fetchProductById)
      .delete('/:id',deleteProductById)
      .patch('/:id',upload.single("image"),updateProduct)


exports.router=router