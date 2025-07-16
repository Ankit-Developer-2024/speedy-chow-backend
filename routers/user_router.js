const express = require('express')
const app = express()
const router = express.Router()
const {signUp}  =require("../controllers/user_controller")

exports.router=
router.get('/',signUp) 
      .post('/',signUp) 
          