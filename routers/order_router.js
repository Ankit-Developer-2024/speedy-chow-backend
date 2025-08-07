const express = require('express')
const router = express.Router()
const { createOrder } = require('../controllers/order_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=router
               .post('/',authJwt,createOrder) 
