const express = require('express')
const router = express.Router()
const { createOrder , fetchAllUserOrder , fetchOrderById } = require('../controllers/order_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=router
               .get('/',authJwt,fetchAllUserOrder) 
               .get('/:id',authJwt,fetchOrderById) 
               .post('/',authJwt,createOrder) 
