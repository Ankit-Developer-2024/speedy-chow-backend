const express = require('express')
const router = express.Router()
const { addToCart,updateCart,fetchCartByUser,fetchCartByProductId,deleteCartItem } = require('../controllers/cart_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=router
               .post('/',authJwt,addToCart)
               .patch('/:id',authJwt,updateCart)
               .get('/',authJwt,fetchCartByUser)
               .get('/:id',authJwt,fetchCartByProductId)
               .delete('/:id',authJwt,deleteCartItem)
