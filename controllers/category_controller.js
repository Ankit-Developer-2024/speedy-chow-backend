const { uploadBufferToCloudinary, deleteImageFromCloudinary } = require("../config/cloudinary_config");
const { Category } = require("../models/category_model");

exports.createCategory=async(req,res)=>{
   try {
      if (!req.file) {
               res
                  .status(400)
                  .json({
                     message: "Image not found!",
                     success: false,
                     rs: 400,
                     data: null,
                  });
               return;
            }
      
            const uploadResponse = await uploadBufferToCloudinary(req.file.buffer, "Category");
            
            let categoryDetails = JSON.parse(req.body.categoryDetails);
            if(uploadResponse){
        categoryDetails.image = uploadResponse.secure_url;
        categoryDetails.imagePublicId=uploadResponse.public_id
      }
      
      let category=new Category(categoryDetails);
      let response = await category.save()
      res.status(201).json({"message":"Category successfully created","success":true,"rs":201,"data":response})
      
   } catch (error) {
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}

exports.fetchAllCategory=async(req,res)=>{
   try {
            
      let response = await Category.find()    
      res.status(200).json({"message":"Category fetch successfully!","success":true,"rs":200,"data":response})
      
   } catch (error) {  
       
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}


exports.deleteCategory=async(req,res)=>{
   try {
      let {id}=req.params;   
      if (!id) {
         res
            .status(400)
            .json({
               message: "Category id is missing!",
               success: false,
               rs: 400,
               data: null,
            });
      }else{
             let response = await Category.findByIdAndDelete(id)    
           if(response){
                         const imgPublicId = response.imagePublicId
                          if(imgPublicId){ 
                             await deleteImageFromCloudinary(imgPublicId) 
                          }
                  res.status(200).json({
                        message: "Category deleted successfully!",
                        success: true,
                        rs: 200,
                        data: response,
                     });
                  }else{
         res.status(400).json({
                        message: "Category Not found!",
                        success: false,
                        rs: 400,
                        data: null,
                     });
                  }
      }   
    
    
   } catch (error) {  
       res.status(400).json({"message":String(error),"success":false,"rs":400,"data":null})
   }
    
}