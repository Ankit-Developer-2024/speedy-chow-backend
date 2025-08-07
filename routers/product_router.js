const express = require('express')
const router = express.Router()
const {createProduct,fetchAllProduct,fetchProductById,updateProduct} = require('../controllers/product_controller')
const authJwt = require('../middlewares/auth_jwt')

router.post('/',createProduct)
      .get('/',authJwt,fetchAllProduct)
      .get('/:id',authJwt,fetchProductById)
      .patch('/:id',authJwt,updateProduct)


exports.router=router