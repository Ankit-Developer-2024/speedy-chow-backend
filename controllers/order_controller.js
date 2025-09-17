const { Cart } = require("../models/cart_model");
const { Order } = require("../models/order_model")
const { Product } = require("../models/product_model");
const createJwtToken = require("../services/global_services");

exports.createOrder=async(req,res)=>{
    try {
      //  let {user,totalAmount,totalItems,items,selectedAddress,paymentMethod}=req.body
        const order=new Order({...req.body,"user":req.user.id})
        //here we need to check and manage the product quantity
        let outOfStock=""
        for(let item of order.items){ 
           let product = await Product.findById(item.product.id);
           if(!product || product.deleted==true ){
             res.status(409).json({"message":`Your ${item.product.name} item currently is not present in database.`,"success":false,"rs":409,"data":null})
             return ;
           }
           
           if(product.totalQuantity<item.quantity){
              outOfStock+=`${product.name},`
           }
        }

        if(outOfStock.length>0){
             res.status(409).json({"message":`Your ${outOfStock} items is out of stock!`,"success":false,"rs":409,"data":null})
             return ;
        }

         for(let item of order.items){ 
           let product = await Product.findById(item.product.id);
           await Cart.findByIdAndDelete(item.id);
           product.totalQuantity=product.totalQuantity-item.quantity
           await product.save();
        }

        
        await order.save();
        const {accessToken,refreshToken} =createJwtToken(req.user);  
        //also send email to user or order creation
        res.status(201).json({"message":"Order created sucessfully!","success":true,"rs":201,accessToken,refreshToken,"data":{"isOrderCreated":true}})

    } catch (error) { 
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
    }
}


exports.fetchAllUserOrder=async(req,res)=>{
   try {
      
      let orders=await Order.find({'user':req.user.id});
      const {accessToken,refreshToken} =createJwtToken(req.user);    
      res.status(200).json({"message":"Product fetch successfully","success":true,"rs":200,"accessToken":accessToken,"refreshToken":refreshToken,"data":orders})
      
   } catch (error) { 
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}

exports.fetchOrderById=async(req,res)=>{
   try {
      let {id} = req.params
      let order=await Order.findById(id)
      const {accessToken,refreshToken} =createJwtToken(req.user);    
      res.status(200).json({"message":"Product fetch successfully","success":true,"rs":200,"accessToken":accessToken,"refreshToken":refreshToken,"data":order})
      
   } catch (error) { 
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}
