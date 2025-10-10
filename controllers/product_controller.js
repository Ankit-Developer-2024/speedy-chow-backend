const { Product } = require("../models/product_model");
const {createJwtToken} = require("../services/global_services");
const { login } = require("./auth_controller");
const { uploadBufferToCloudinary , deleteImageFromCloudinary } = require("../config/cloudinary_config");

exports.createProduct = async (req, res) => {
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

      const uploadResponse = await uploadBufferToCloudinary(req.file.buffer, "Product");

      let productDetails = JSON.parse(req.body.productDetails);
      if(uploadResponse){
        productDetails.image = uploadResponse.secure_url;
        productDetails.imagePublicId=uploadResponse.public_id
      }
   
      productDetails.discountedPrice = Math.round(
         productDetails.price * (1 - productDetails.discountPercentage / 100)
      );

      let product = new Product(productDetails);
      let response = await product.save();

      res
         .status(201)
         .json({
            message: "Product successfully created",
            success: true,
            rs: 201,
            data: response,
         });
   } catch (error) {
      res
         .status(400)
         .json({ message: String(error), success: false, rs: 400, data: null });
   }
};

exports.fetchAllProduct = async (req, res) => {
   try {
      let condition = {};
      if (!req.query.admin) {
         condition.deleted = { $ne: true };
      } 
      
      let query = Product.find(condition);
      if (req.query.category || req.query["category[]"]) {
         if (req.query["category[]"]) {
            query = query.find({ category: { $in: req.query["category[]"] } });
         } else {
            query = query.find({ category: { $in: req.query.category } });
         }
      }
      if (req.query.qName) {
         query = query.find({ name: { $in: req.query.qName } });
      }

      const { accessToken, refreshToken } = createJwtToken(req.user);
      let response = await query.exec();

      res
         .status(200)
         .json({
            message: "Product fetch successfully",
            success: true,
            rs: 200,
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: response,
         });
   } catch (error) {
      res
         .status(500)
         .json({ message: String(error), success: false, rs: 500, data: null });
   }
};

exports.fetchProductById = async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         res
            .status(400)
            .json({
               message: "Product id is missing",
               success: false,
               rs: 400,
               data: null,
            });
      } else {
         let response = await Product.findById(id);
         const { accessToken, refreshToken } = createJwtToken(req.user);
         res
            .status(200)
            .json({
               message: "Product fetch successfully",
               success: true,
               accessToken,
               refreshToken,
               rs: 200,
               data: response,
            });
      }
   } catch (error) {
      res
         .status(500)
         .json({ message: String(error), success: false, rs: 500, data: null });
   }
};

exports.updateProduct = async (req, res) => {
   try {
      let { id } = req.params;
      let productInfo=await Product.findById(id);
          if(!productInfo){
          res.status(400).json({"message":"Product not found!","success":false,"rs":400,"data":null})
          }
    
      let productDetails = JSON.parse(req.body.productDetails);
       if (req.file) {
      const uploadResponse = await uploadBufferToCloudinary(req.file.buffer, "Product");
      if(uploadResponse){
        productDetails.image = uploadResponse.secure_url;
        productDetails.imagePublicId=uploadResponse.public_id
        if(productInfo.imagePublicId){ 
            await deleteImageFromCloudinary(productInfo.imagePublicId) 
         }
      }
     }
      productDetails.discountedPrice = Math.round(
         productDetails.price * (1 - productDetails.discountPercentage / 100)
      );

      const updatedProduct = await Product.findByIdAndUpdate(id, productDetails, {
         new: true,
      });

      res
         .status(200)
         .json({
            message: "Product successfully updated",
            success: true,
            rs: 200,
            data: updatedProduct,
         });
   } catch (error) {
      res
         .status(500)
         .json({ message: String(error), success: false, rs: 500, data: null });
   }
};

exports.deleteProductById = async (req, res) => {
   try {
      const { id } = req.params;
      if (!id) {
         res
            .status(400)
            .json({
               message: "Product id is missing",
               success: false,
               rs: 400,
               data: null,
            });
      } else {
         let response = await Product.findByIdAndDelete(id);
         if(response){
                const imgPublicId = response.imagePublicId
                 if(imgPublicId){ 
                    await deleteImageFromCloudinary(imgPublicId) 
                 }
         res.status(200).json({
               message: "Product deleted successfully!",
               success: true,
               rs: 200,
               data: response,
            });
         }else{
res.status(400).json({
               message: "Product Not found!",
               success: false,
               rs: 400,
               data: null,
            });
         }
      }
   } catch (error) {
      res
         .status(500)
         .json({ message: String(error), success: false, rs: 500, data: null });
   }
};

exports.searchProductByName = async (req, res) => {
   try {
      const { qName } = req.query;

      if (!qName)
         return res
            .status(400)
            .json({
               message: "No search query find!",
               success: false,
               rs: 400,
               data: null,
            });

      const products = await Product.aggregate([
         {
            $search: {
               index: "fuzzySearch",
               autocomplete: {
                  query: qName,
                  path: "name", // field to search
                  fuzzy: { maxEdits: 1 }, // allows small typos (optional)
               },
            },
         },
         { $limit: 10 }, // return only 10 results
         {
            $project: {
               _id: 1,
               image:1,
               name: 1,
               discountedPrice: 1,
            },
         },
      ]);

      res
         .status(200)
         .json({
            message: "Product Searched",
            success: true,
            rs: 200,
            data: products,
         });
   } catch (error) {
      console.error(error);
      res
         .status(500)
         .json({ message: String(error), success: false, rs: 500, data: null });
   }
};
