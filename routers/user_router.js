const express = require('express')
const router = express.Router()
const {updateUser, fetchUser ,updateUserAddress, fetchAllUser} = require('../controllers/user_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=
        router.get('/',authJwt,fetchUser) 
         router.get('/all',authJwt,fetchAllUser) 
        router.patch('/',authJwt,updateUser) 
        router.patch('/addresses/:id',authJwt,updateUserAddress)         