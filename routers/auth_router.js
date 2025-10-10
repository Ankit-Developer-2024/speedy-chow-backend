const express = require('express')
const app = express()
const router = express.Router()
const {signUp,login,resetPasswordRequest,resetPassword,refreshToken,verifyToken, checkUser, signOut, verifyOtp, webLogin}  =require("../controllers/auth_controller")
const authJwt = require('../middlewares/auth_jwt')
const passport = require('../services/passportService')

exports.router=
router.post('/signUp',signUp) 
      .post('/login',passport.authenticate('local',{ session: false}),login) 
      .post('/web-login',passport.authenticate('local',{ session: false}),webLogin) 
      .get('/check',passport.authenticate('jwt',{ session: false }),checkUser)
      .post('/reset-password-request',resetPasswordRequest) 
      .post('/verify-otp',verifyOtp) 
      .patch('/reset-password',resetPassword)
      .get('/refresh-token',refreshToken)
      .get('/verify',passport.authenticate('jwt',{ session: false }),verifyToken)
      .get('/signOut',signOut)
      
      