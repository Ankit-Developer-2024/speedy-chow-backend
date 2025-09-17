const {Product} = require('../models/product_model');
const createJwtToken = require('../services/global_services');
const { login } = require('./auth_controller');

exports.createProduct=async(req,res)=>{
   try { 
     
      if(!req.file){
       res.status(400).json({"message":"Image not found!","success":false,"rs":400,"data":null})
       return;
      }

      let productDetails=JSON.parse(req.body.productDetails);
      productDetails.image=req.file.buffer 
      let product=new Product(productDetails);
      product.discountedPrice=Math.round(product.price *(1-product.discountPercentage/100))
      let response = await product.save() 
      
      res.status(201).json({"message":"Product successfully created","success":true,"rs":201,"data":response})
      
   } catch (error) { 
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}

exports.fetchAllProduct=async(req,res)=>{
   try {
      
       let condition={};
       if(!req.query.admin){
          condition.deleted={$ne:true}
       }
       
      let query=Product.find(condition);
      if(req.query.category){ 
         
        query=query.find({category:{$in:req.query.category} })
      }     
      
     const {accessToken,refreshToken} =createJwtToken(req.user);     
      let response = await query.exec();      
      res.status(200).json({"message":"Product fetch successfully","success":true,"rs":200,"accessToken":accessToken,"refreshToken":refreshToken,"data":response})
      
   } catch (error) { 
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}


exports.fetchProductById=async(req,res)=>{
   try {

      const {id}=req.params
      if(!id){
        res.status(400).json({"message":"Product id is missing","success":false,"rs":400,"data":null})  
      }else{
       let response = await Product.findById(id); 
       const {accessToken,refreshToken} =createJwtToken(req.user);  
       res.status(200).json({"message":"Product fetch successfully","success":true,accessToken,refreshToken,"rs":200,"data":response})
      }  
   } catch (error) {
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}

exports.updateProduct=async(req,res)=>{
    try {
      
       let {id}=req.params

        const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
        product.discountedPrice=Math.round(product.price*(1-product.discountPercentage/100))
        const updatedProduct = await product.save();
        res.status(201).json({"message":"Product successfully updated","success":true,"rs":201,"data":updatedProduct})
      
    } catch (error) {
           res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
    }
}