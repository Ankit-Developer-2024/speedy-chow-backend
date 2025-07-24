const express = require('express')
const router = express.Router()
const { createOrder } = require('../controllers/order_controller')

exports.router=router
               .post('/',createOrder) 
