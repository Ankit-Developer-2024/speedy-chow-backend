const express = require('express')
const router = express.Router()
const {updateUser, fetchUser} = require('../controllers/user_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=
        router.get('/',authJwt,fetchUser) 
        router.patch('/:id',authJwt,updateUser) 
          