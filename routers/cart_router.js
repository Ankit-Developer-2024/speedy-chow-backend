const express = require('express')
const router = express.Router()
const { addToCart,updateCart,fetchCartByUser,deleteCartItem } = require('../controllers/cart_controller')

exports.router=router
               .post('/',addToCart)
               .patch('/:id',updateCart)
               .get('/',fetchCartByUser)
               .delete('/:id',deleteCartItem)
