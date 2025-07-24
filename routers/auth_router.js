const express = require('express')
const app = express()
const router = express.Router()
const {signUp,login,resetPasswordRequest,resetPassword}  =require("../controllers/auth_controller")

exports.router=
router.post('/signUp',signUp) 
      .post('/login',login) 
      .post('/reset-password-request',resetPasswordRequest)
      .patch('/reset-password',resetPassword)