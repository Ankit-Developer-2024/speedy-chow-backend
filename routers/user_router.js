const express = require('express')
const router = express.Router()
const {updateUser, fetchUser ,updateUserAddress, fetchAllUser, deleteUserById, updateUserRoleAndStatus, deleteMultipleUserById} = require('../controllers/user_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=
        router.get('/',authJwt,fetchUser) 
        router.get('/all',authJwt,fetchAllUser) 
        router.patch('/',authJwt,updateUser) 
        router.patch('/:id',authJwt,updateUserRoleAndStatus) 
        router.patch('/addresses/:id',authJwt,updateUserAddress)  
        router.delete('/:id',authJwt,deleteUserById)   
        router.delete('/',authJwt,deleteMultipleUserById)       