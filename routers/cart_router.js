const express = require('express')
const router = express.Router()
const { addToCart,updateCart,fetchCartByUser,fetchCartByProductId,deleteCartItem } = require('../controllers/cart_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=router
               .post('/',addToCart)
               .patch('/:id',updateCart)
               .get('/',fetchCartByUser)
               .get('/:id',fetchCartByProductId)
               .delete('/:id',deleteCartItem)
