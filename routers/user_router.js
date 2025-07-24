const express = require('express')
const router = express.Router()
const {updateUser} = require('../controllers/user_controller')

exports.router=
        router.patch('/:id',updateUser) 
          