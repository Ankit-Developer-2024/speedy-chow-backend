const express = require("express") 
const app=express() 
const db=require('./config/db')  
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter=require('./routers/user_router')
const authRouter=require('./routers/auth_router')
const productRouter =  require('./routers/product_router')
const categoryRouter =  require('./routers/category_router')
const cartRouter =  require('./routers/cart_router')
const orderRouter =  require('./routers/order_router')
const passport = require('./services/passportService');  
const razorpayInstance=require('./config/razorpay_config')

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend's origin
   credentials: true, 
};

app.use(cors(corsOptions)); 
 
app.use(express.json({ limit: "50mb" }))  
app.use(cookieParser())
app.use(passport.initialize());

app.use('/auth',authRouter.router)
app.use('/user', passport.authenticate('jwt',{ session: false }),userRouter.router)
app.use('/product',passport.authenticate('jwt',{ session: false }),productRouter.router)
app.use('/category', passport.authenticate('jwt',{ session: false }),categoryRouter.router)
app.use('/cart', passport.authenticate('jwt',{ session: false }),cartRouter.router)
app.use('/order',passport.authenticate('jwt',{ session: false }),orderRouter.router)


app.listen(process.env.PORT,(req,res)=>{
   // console.log("App run on",process.env.PORT)
})  