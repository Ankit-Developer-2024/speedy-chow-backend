const { Category } = require("../models/category_model");

exports.createCategory=async(req,res)=>{
   try {
      
      let category=new Category(req.body);
      let response = await category.save()
      res.status(201).json({"message":"Category successfully created","success":true,"rs":201,"data":response})
      
   } catch (error) {
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}

exports.fetchAllCategory=async(req,res)=>{
   try {
            
      let response = await Category.find()    
      res.status(200).json({"message":"Category fetch successfully","success":true,"rs":200,"data":response})
      
   } catch (error) { 
       console.log("fetchAllCategory--",error);
       
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}