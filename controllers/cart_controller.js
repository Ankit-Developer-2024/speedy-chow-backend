const { Cart } = require("../models/cart_model");
const {createJwtToken} = require("../services/global_services");
require('../models/product_model'); 

exports.fetchCartByUser=async(req,res)=>{
   const {id}=req.user
    try{ 
        const {accessToken,refreshToken} =createJwtToken(req.user);  
        const response=await Cart.find({user:id}).populate('user').populate('product')
        res.status(200).json({"message":"Cart item fetch sucessfully","success":true,"rs":200,accessToken,refreshToken,"data":response})
    }
    catch(error){
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
    }
}

exports.fetchCartByProductId=async(req,res)=>{

   const {id}=req.params
    try{ 
        if(!id){
        res.status(400).json({"message":"Product id missing for fetch the product","success":false,"rs":400,"data":null})
        return ;
    }else{   
             const userId=req.user.id; 
             const response=await Cart.find({product:id,user:userId}).populate('user').populate('product')
             const {accessToken,refreshToken} =createJwtToken(req.user);  
             res.status(200).json({"message":"Cart item fetch sucessfully","success":true,"rs":200,accessToken,refreshToken,"data":response}) 
                return  ;
            }
    }
    catch(error){
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null}) 
    }
}

exports.addToCart=async(req,res)=>{
    try {
        const {quantity,productId}=req.body 
        const {id}=req.user;
        if(quantity && productId){
            const cart= new Cart({quantity,product:productId,user:id}) 
            const response =await (await cart.save());
            const {accessToken,refreshToken} =createJwtToken(req.user);  
            res.status(200).json({"message":"Item added in cart sucessfully","success":true,"rs":200,accessToken,refreshToken,"data":response})
        }else{
            res.status(400).json({"message":"Add to cart: Data missing","success":false,"rs":400,"data":null})
        }
       
    } catch (error) {
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
}

exports.updateCart=async(req,res)=>{
    try {
        let {id}=req.params 
        if(!id){
         res.status(400).json({"message":"Cart id missing for update ","success":false,"rs":400,"data":null})        
        }else{    
         const {accessToken,refreshToken} =createJwtToken(req.user);  
         const response =await Cart.findByIdAndUpdate(id,req.body,{new:true}).populate('user').populate('product')
         res.status(200).json({"message":"Cart item updated sucessfully","success":true,"rs":200,accessToken,refreshToken,"data":response})
        }
    } catch (error) {
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
}

exports.deleteCartItem=async(req,res)=>{
    try { 
         let {id}=req.params  
        if(!id){
         res.status(400).json({"message":"Cart id missing for delete ","success":false,"rs":400,"data":null})        
        }else{
           const response=await Cart.findByIdAndDelete(id).populate('product')
         const {accessToken,refreshToken} =createJwtToken(req.user);  
        res.status(200).json({"message":"Cart item deleted sucessfully","success":true,"rs":200,accessToken,refreshToken,"data":response})
      
        }
       
    } catch (error) { 
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null}) 
    }
}

