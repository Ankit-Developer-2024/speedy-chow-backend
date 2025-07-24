const { Order } = require("../models/order_model")

exports.createOrder=async(req,res)=>{
    try {
      //  let {user,totalAmount,totalItems,items,selectedAddress,paymentMethod}=req.body
        const order=new Order(req.body)
        //here we need to check and manage the product quantity
        const response=await order.save();
        //also send email to user or order creation
        res.status(201).json({"message":"Order created sucessfully","success":true,"rs":200,"data":response})

    } catch (error) {
        res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
    }
}