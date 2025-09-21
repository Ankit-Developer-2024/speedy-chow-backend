const express = require('express')
const router = express.Router()
const { createOrder , fetchAllUserOrder , fetchOrderById, fetchAllOrder, updateOrder, deleteOrderById, deleteMultipleOrderByIds, searchOrderByUserAndOrderId } = require('../controllers/order_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=router
               .get('/',authJwt,fetchAllUserOrder) 
               .get('/all',authJwt,fetchAllOrder)
               .get('/:id',authJwt,fetchOrderById) 
               .post('/',authJwt,createOrder) 
               .patch('/:id',authJwt,updateOrder)
               .delete('/:id',authJwt,deleteOrderById)   
               .delete('/',authJwt,deleteMultipleOrderByIds)   
