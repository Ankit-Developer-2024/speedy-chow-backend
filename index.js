const express = require("express")
const app=express()
const router=express.Router();
const db=require('./db')
const userRouter=require('./routers/user_router')
const productRouter =  require('./routers/product_router')

app.use('/user',userRouter.router)
app.use('/product',productRouter.router)

 

app.listen(3000,(req,res)=>{
    console.log("App run 3000")
}) 