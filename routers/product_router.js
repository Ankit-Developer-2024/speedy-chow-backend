const express = require('express')
const router = express.Router()
const {createProduct,fetchAllProduct,fetchProductById,updateProduct, deleteProductById} = require('../controllers/product_controller')
const authJwt = require('../middlewares/auth_jwt')
const upload= require('../config/multer_config')




router.post('/',upload.single("image"),createProduct)
      .get('/',authJwt,fetchAllProduct)
      .get('/:id',authJwt,fetchProductById)
      .delete('/:id',authJwt,deleteProductById)
      .patch('/:id',[authJwt,upload.single("image")],updateProduct)


exports.router=router