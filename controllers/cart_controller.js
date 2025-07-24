const { Cart } = require("../models/cart_model")
require('../models/product_model'); 

exports.fetchCartByUser=async(req,res)=>{
   const {id}=req.params
    try{
        const response=await Cart.find({user:id}).populate('user').populate('product')
        res.status(200).json({"message":"Cart item fetch sucessfully","success":true,"rs":200,"data":response})
        
    }
    catch(error){
        res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
    }
}

exports.addToCart=async(req,res)=>{
    try {
        const {quantity,productId,userId}=req.body
        const cart= new Cart({quantity,product:productId,user:userId})
        const response =await (await cart.save()).populate('product');
        res.status(200).json({"message":"Item added in cart sucessfully","success":true,"rs":200,"data":response})
        
    } catch (error) {
        res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
   }
}

exports.updateCart=async(req,res)=>{
    try {
        let {id}=req.params 
        const response =await Cart.findByIdAndUpdate(id,req.body,{new:true}).populate('user').populate('product')
        res.status(200).json({"message":"Cart item updated sucessfully","success":true,"rs":200,"data":response})
        
    } catch (error) {
        res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
   }
}

exports.deleteCartItem=async(req,res)=>{
    try {
        let {id}=req.params 
        const response=await Cart.findByIdAndDelete(id)
        res.status(200).json({"message":"Cart item deleted sucessfully","success":true,"rs":200,"data":response})
      
    } catch (error) {
        res.status(400).json({"message":error,"success":false,"rs":400,"data":null}) 
    }
}

