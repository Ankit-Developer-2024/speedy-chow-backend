const express = require("express") 
const app=express() 
const db=require('./config/db')  
const cors = require('cors');
const userRouter=require('./routers/user_router')
const authRouter=require('./routers/auth_router')
const productRouter =  require('./routers/product_router')
const categoryRouter =  require('./routers/category_router')
const cartRouter =  require('./routers/cart_router')
const orderRouter =  require('./routers/order_router')

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend's origin
};

app.use(cors(corsOptions)); 
 
app.use(express.json()) 
app.use('/auth',authRouter.router)
app.use('/user',userRouter.router)
app.use('/product',productRouter.router)
app.use('/category',categoryRouter.router)
app.use('/cart',cartRouter.router)
app.use('/order',orderRouter.router)

 

app.listen(process.env.PORT,(req,res)=>{
    console.log("App run on",process.env.PORT)
}) 