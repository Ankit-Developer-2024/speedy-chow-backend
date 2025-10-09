const { Cart } = require("../models/cart_model");
const { Order } = require("../models/order_model")
const { Product } = require("../models/product_model");
const {Razorpay} = require("../models/razorpay_model")
const {createJwtToken,validatePaymentVerification,sendOrderConfirmationMail} = require("../services/global_services");
const razorpayInstance = require('../config/razorpay_config');
const e = require("express");

exports.razorpayCreateOrderApi=async(req,res)=>{
     try { 
      
       let {amount,otherDetails}=req.body;  
        
       let options={
         amount:amount,
         currency: "INR",
         notes:otherDetails
       }

       const orderDB= await Order({paymentMethod:"Razorpay",user:req.user.id,totalAmount:amount/100})
       await orderDB.save();

       const response = await razorpayInstance.orders.create(options) 

       if(response['id']){ 
         const razorpayRes= Razorpay({user:req.user.id,razorpay_order_id:response.id,order_id_db:orderDB.id})
         await razorpayRes.save() 
       }else{
         return  res.status(400).json({"message":"Razorpay payment/order api data not found!","success":false,"rs":400,"data":null});
       }
      
       res.status(200).json({"message":"Razorpay order id created success","success":true,"rs":200,"data":response});
      } catch (error) { 
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
     }  
}

exports.razorpaySaveVerifyApi=async(req,res)=>{
     try {
       
       let {paymentId,orderId,paymentSignature}=req.body;  
       
       if(!paymentId || !orderId || !paymentSignature){
         return res.status(400).json({"message":"Razorpay payment data not found!","success":false,"rs":400,"data":null});
       }
      
       let razorpayResp= await Razorpay.find({user: req.user.id,razorpay_order_id:orderId});
       if(!razorpayResp){
          return res.status(404).json({"message":"Razorpay payment data not found!","success":false,"rs":404,"data":null});
       } 

       //save and verify signature 
       const razorpay=await Razorpay.findByIdAndUpdate(razorpayResp[0].id,{razorpay_payment_id:paymentId,razorpay_signature:paymentSignature})
        
       if(razorpay){
          const isVerify= validatePaymentVerification(orderId,paymentId,paymentSignature)
       
          if(isVerify){
            await Razorpay.findByIdAndUpdate(razorpayResp[0].id,{status:"success"})
            await Order.findByIdAndUpdate(razorpayResp[0].order_id_db,{paymentStatus:"success",status:"Order Confirmed"})
           return  res.status(200).json({"message":"Razorpay payment success!","success":true,"rs":200,"data":{"verify":isVerify}});
          }else{
            await Razorpay.findByIdAndUpdate(razorpayResp[0].id,{status:"failed"})
           await Order.findByIdAndUpdate(razorpayResp[0].order_id_db,{paymentStatus:"failed"})
           return  res.status(200).json({"message":"Razorpay payment success!","success":true,"rs":200,"data":{"verify":isVerify}});
         
          }
          
       } else{
         return res.status(404).json({"message":"Razorpay payment data not found!","success":false,"rs":404,"data":null});
       }
   
        
     } catch (error) { 
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
     }
}

exports.createOrder=async(req,res)=>{
    try { 

      //  let {user,totalAmount,totalItems,items,selectedAddress,paymentMethod}=req.body
        if(req.body.paymentId.length!==0 && req.body.paymentMethod==='Razorpay'){
          const razorpayResp= await Razorpay.find({user: req.user.id,razorpay_payment_id:req.body.paymentId}); 
          if(razorpayResp){
           
            const isOrder = await Order.findById(razorpayResp[0].order_id_db)
            if(isOrder){
                let outOfStock=""
        for(let item of req.body.items){ 
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

         for(let item of req.body.items){ 
           let product = await Product.findById(item.product.id);
           await Cart.findByIdAndDelete(item.id);
           product.totalQuantity=product.totalQuantity-item.quantity
           await product.save();
        }
        //order
        const order = await Order.findByIdAndUpdate(
               razorpayResp[0].order_id_db,
               {items:req.body.items,
                totalItems:req.body.totalItems,
                selectedAddress:req.body.selectedAddress
               }
            )
           sendOrderConfirmationMail(req.user.email,order.id,req.body.paymentId)
         const {accessToken,refreshToken} =createJwtToken(req.user);  
         return res.status(201).json({"message":"Order created sucessfully!","success":true,"rs":201,accessToken,refreshToken,"data":{"isOrderCreated":true}})

          }else{
             return res.status(404).json({"message":"Order not found for this payment id!","success":false,"rs":404,"data":null});
        
        }                 
         } else{
             return res.status(404).json({"message":"Payment data not found for this payment id!","success":false,"rs":404,"data":null});
          }
          
         }else{


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

        
        let orderResp= await order.save(); 
        sendOrderConfirmationMail(req.user.email,orderResp.id,"")
        const {accessToken,refreshToken} =createJwtToken(req.user);  
        //also send email to user or order creation
        res.status(201).json({"message":"Order created sucessfully!","success":true,"rs":201,accessToken,refreshToken,"data":{"isOrderCreated":true}})
      }
    } catch (error) { 

        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
    }
}


exports.fetchAllUserOrder=async(req,res)=>{
   try {
      
      let orders=await Order.find({'user':req.user.id ,items:{ $not: { $size: 0 } } });
      const {accessToken,refreshToken} =createJwtToken(req.user);    
      res.status(200).json({"message":"Order fetch successfully","success":true,"rs":200,"accessToken":accessToken,"refreshToken":refreshToken,"data":orders})
      
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


exports.fetchAllOrder=async(req,res)=>{
   try {
      let {id , paymentMethod,status}=req.query
      
      if(id){
        let orders =await Order.find({_id:id,items:{ $not: { $size: 0 } }})
        return res.status(200).json({"message":"Orders fetch successfully","success":true,"rs":200,"data":orders})
      }

      let condition={}
      if(paymentMethod){
         condition.paymentMethod={$in:paymentMethod}
      }
      if(status){
         condition.status={$in:status}
      }

       let orders=await Order.find(condition).sort({ createdAt: -1}).exec(); 
      
         
      res.status(200).json({"message":"Order fetch successfully","success":true,"rs":200,"data":orders})
      
   } catch (error) {  
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}


exports.updateOrder=async(req,res)=>{
  try {
    let {id}= req.params    
    
    let order= await Order.findByIdAndUpdate(id,req.body,{new:true})
       res
        .status(200)
        .json({
          message: "Order updated successfully",
          success: true,
          rs: 200, 
          data: order,
        });

  } catch (error) { 
     res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}


exports.deleteOrderById=async(req,res)=>{
   try {
     let { id } = req.params;  
       let response = await Order.findByIdAndDelete(id);
       res.status(200).json({"message":"Order deleted successfully","success":true,"rs":200,"data":response})
       
   } catch (error) {
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
}

exports.deleteMultipleOrderByIds=async(req,res)=>{
   try { 
     let { orderIds } = req.body;   
      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
          return res.status(400).json({ message: 'No order IDs provided for deletion.',"success":false,"rs":400,"data":null });
         }
       const orders = await Order.find({_id:{$in:[...orderIds]}});  
       let response = await Order.deleteMany({_id:{$in:[...orderIds]}}); 
       if (response.deletedCount === 0) {
         return res.status(404).json({ message: 'No orders found with the provided IDs.',"success":false,"rs":404,"data":null });
        } 
    
        let  deletedOrders={orders}
       res.status(200).json({"message":`${response.deletedCount} orders deleted successfully`,"success":true,"rs":200,"data":deletedOrders})
       
   } catch (error) { 
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}