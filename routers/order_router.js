const express = require('express')
const router = express.Router()
const { createOrder , fetchAllUserOrder , fetchOrderById, fetchAllOrder, updateOrder, deleteOrderById, deleteMultipleOrderByIds, searchOrderByUserAndOrderId } = require('../controllers/order_controller')
const authJwt = require('../middlewares/auth_jwt')
const upload = require('../config/multer_config')

exports.router=router
               .get('/',fetchAllUserOrder) 
               .get('/all',fetchAllOrder)
               .get('/:id',fetchOrderById) 
               .post('/',createOrder) 
               .patch('/:id',updateOrder)
               .delete('/:id',deleteOrderById)   
               .delete('/',deleteMultipleOrderByIds)   
