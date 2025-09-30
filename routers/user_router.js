const express = require('express')
const router = express.Router()
const {updateUser, fetchUser ,updateUserAddress, fetchAllUser, deleteUserById, updateUserRoleAndStatus, deleteMultipleUserById, searchUserByName} = require('../controllers/user_controller')
const authJwt = require('../middlewares/auth_jwt')

exports.router=
        router.get('/',fetchUser) 
        router.get('/all',fetchAllUser) 
        router.get('/search',searchUserByName)
        router.patch('/',updateUser) 
        router.patch('/:id',updateUserRoleAndStatus) 
        router.patch('/addresses/:id',updateUserAddress)  
        router.delete('/:id',deleteUserById)   
        router.delete('/',deleteMultipleUserById)       