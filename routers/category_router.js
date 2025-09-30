const express = require('express')
const router = express.Router()
const {createCategory,fetchAllCategory} = require('../controllers/category_controller')
const authJwt = require('../middlewares/auth_jwt')
const passport = require('../services/passportService')

exports.router=
      router.post('/',createCategory)
            .get('/',fetchAllCategory)