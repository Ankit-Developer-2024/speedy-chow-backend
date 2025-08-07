const express = require('express')
const app = express()
const router = express.Router()
const {signUp,login,resetPasswordRequest,resetPassword,refreshToken,verifyToken}  =require("../controllers/auth_controller")
const authJwt = require('../middlewares/auth_jwt')

exports.router=
router.post('/signUp',signUp) 
      .post('/login',login) 
      .post('/reset-password-request',resetPasswordRequest)
      .patch('/reset-password',resetPassword)
      .get('/refresh-token',authJwt,refreshToken)
      .get('/verify',authJwt,verifyToken)
      
      