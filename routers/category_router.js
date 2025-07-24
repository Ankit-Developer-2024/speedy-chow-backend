const express = require('express')
const router = express.Router()
const {createCategory,fetchAllCategory} = require('../controllers/category_controller')

exports.router=
      router.post('/',createCategory)
            .get('/',fetchAllCategory)