const {Product} = require('../models/product_model')

exports.createProduct=async(req,res)=>{
   try {
      
      let product=new Product(req.body);
          product.discountedPrice=Math.round(product.price *(1-product.discountPercentage/100))

      let response = await product.save()
      res.status(201).json({"message":"Product successfully created","success":true,"rs":201,"data":response})
      
   } catch (error) {
       res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
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
        query=query.find({category:{$in:req.query.category.split(',') } })
      }     
      
      let response = await query.exec();      

      res.status(200).json({"message":"Product fetch successfully","success":true,"rs":200,"data":response})
      
   } catch (error) { 
       res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
   }
    
}


exports.fetchProductById=async(req,res)=>{
   try {

      const {id}=req.params  

      let response = await Product.findById(id); 
      res.status(200).json({"message":"Product fetch successfully","success":true,"rs":200,"data":response})
      
   } catch (error) {
       res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
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
           res.status(400).json({"message":error,"success":false,"rs":400,"data":null})
    }
}