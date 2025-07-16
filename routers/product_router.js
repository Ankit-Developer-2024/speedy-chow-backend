const express = require('express')
const router = express.Router()
const {createProduct} = require('../controllers/product_controller')

router.get('/',createProduct)

exports.router=router