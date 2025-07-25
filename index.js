const express = require("express")
const app=express()
const router=express.Router();
const db=require('./db')
const userRouter=require('./routers/user_router')
const authRouter=require('./routers/auth_router')
const productRouter =  require('./routers/product_router')
const categoryRouter =  require('./routers/category_router')
const cartRouter =  require('./routers/cart_router')
const orderRouter =  require('./routers/order_router')

app.use(express.json())
app.use('/auth',authRouter.router)
app.use('/user',userRouter.router)
app.use('/product',productRouter.router)
app.use('/category',categoryRouter.router)
app.use('/cart',cartRouter.router)
app.use('/order',orderRouter.router)

 

app.listen(3000,(req,res)=>{
    console.log("App run 3000")
}) 