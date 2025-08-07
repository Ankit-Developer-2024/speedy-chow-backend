const express = require('express')
const router = express.Router()
const {createCategory,fetchAllCategory} = require('../controllers/category_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=
      router.post('/',createCategory)
            .get('/',authJwt,fetchAllCategory)