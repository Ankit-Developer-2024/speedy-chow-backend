const express = require('express')
const router = express.Router()
const { 
    createOrder ,
    fetchAllUserOrder ,
    fetchOrderById,
    fetchAllOrder,
    updateOrder,
    deleteOrderById,
    deleteMultipleOrderByIds, 
    razorpayCreateOrderApi, 
    razorpaySaveVerifyApi} = require('../controllers/order_controller') 

exports.router=router
               .get('/',fetchAllUserOrder) 
               .get('/all',fetchAllOrder)
               .get('/:id',fetchOrderById) 
               .post('/razorpay-order-id',razorpayCreateOrderApi) 
               .post('/razorpay-save-verify',razorpaySaveVerifyApi) 
               .post('/',createOrder) 
               .patch('/:id',updateOrder)
               .delete('/:id',deleteOrderById)   
               .delete('/',deleteMultipleOrderByIds)   
