const { User } = require("../models/user_model");
const createJwtToken = require("../services/global_services");
const {uploadBufferToCloudinary,deleteImageFromCloudinary} = require('../config/cloudinary_config')

exports.fetchUser = async (req, res) => {
  try {
    let { id } = req.user;
  
    let user = await User.findById(id);
     const {accessToken,refreshToken} =createJwtToken(req.user); 
    if (user) {
      let userData = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        phone: user.phone,
        addresses: user.addresses,
        image: user.image,
        role: user.role,
      };
      res
        .status(200)
        .json({
          message: "User fetch successfully",
          success: true,
          rs: 200,
          accessToken,
          refreshToken,
          data: userData,
        });

    } else {
      res
        .status(400)
        .json({
          message: "User not found",
          success: true,
          rs: 400,
          accessToken,
          refreshToken,
          data: null,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.fetchAllUser = async(req,res) =>{
  try {
    
    let condition={};
    if(req.query.qName){
      condition.name={$in:req.query.qName}
    }
    if(req.query.role){
      condition.role={$in:req.query.role}
    } 
    if(req.query.status){
       condition.status={$in:req.query.status}
    } 
    let users = await User.find(condition).sort({ createdAt: -1}).exec(); 
     
    if (users) {
      let userData = users.map((user)=>{
          return {
        id:user.id,    
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        joinedAt:user.createdAt,
        status:user.status,
      };
      });
      res
        .status(200)
        .json({
          message: "User fetch successfully",
          success: true,
          rs: 200, 
          data: userData,
        });
    
  }
 } catch (error) { 
        res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}

exports.updateUser = async (req, res) => {
  try { 
    let { id } = req.user;
    let { addresses } = req.body;
    if (addresses) {
      let user = await User.findById(id);
      user.addresses.push(addresses);
      user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { addresses: user.addresses } },
        { new: true, runValidators: true }
      );
      let userData = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        image:user.image,
        gender: user.gender,
        addresses: user.addresses,
        phone: user.phone,
        role: user.role,
      };
      const {accessToken,refreshToken} =createJwtToken(req.user);  
      res.status(200) .json({
          message: "User updated successfully",
          success: true,
          rs: 200,
          accessToken,
          refreshToken,
          data: userData,
        });
    }
    else { 
      let user = await User.findByIdAndUpdate( id,{ ...req.body },{ new: true });
      let userData = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        image:user.image,
        gender: user.gender,
        addresses: addresses,
        phone: user.phone,
        role: user.role,
      };
      const {accessToken,refreshToken} =createJwtToken(req.user);  
      res
        .status(200)
        .json({
          message: "User updated successfully",
          success: true,
          rs: 200,
          accessToken,
          refreshToken,
          data: userData,
        });
    }
  } catch (error) { 
    
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.updateUserImage=async(req,res)=>{
  try {   
    
    if(!req.file){
     res.status(400).json({"message":"Image not found!","success":false,"rs":400,"data":null})
    }

    let userInfo=await User.findById(req.user.id);
    if(!userInfo){
    res.status(400).json({"message":"User not found!","success":false,"rs":400,"data":null})
    }
    let input={}
    const uploadResponse = await uploadBufferToCloudinary(req.file.buffer, "Users"); 
      if(uploadResponse){
        input.image = uploadResponse.secure_url;
        input.imagePublicId=uploadResponse.public_id
        if(userInfo.imagePublicId){ 
           await deleteImageFromCloudinary(userInfo.imagePublicId) 
        }
      }
    let user= await User.findByIdAndUpdate(req.user.id,input,{new:true})
     let userData = {
        id:user.id,    
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        joinedAt:user.createdAt,
        status:user.status,
      };
       res
        .status(200)
        .json({
          message: "Image upload successfully!",
          success: true,
          rs: 200, 
          data: userData,
        });

  } catch (error) {  
     res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}

exports.updateUserRoleAndStatus=async(req,res)=>{
  try {
    let {id}= req.params    
    
    let user= await User.findByIdAndUpdate(id,req.body,{new:true})
     let userData = {
        id:user.id,    
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        joinedAt:user.createdAt,
        status:user.status,
      };
       res
        .status(200)
        .json({
          message: "User updated successfully",
          success: true,
          rs: 200, 
          data: userData,
        });

  } catch (error) { 
     res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}

exports.updateUserAddress = async (req, res) => {
  try {
    let { id } = req.user;  
    
    let user = await User.findById(id);
     user.addresses.forEach((item,i)=>{
      if(item.id===req.params.id){ 
        item.houseNo=req.body.addresses.houseNo 
        item.street=req.body.addresses.street 
        item.city=req.body.addresses.city 
        item.landMark=req.body.addresses.landMark 
        item.state=req.body.addresses.state 
        item.zipcode=req.body.addresses.zipcode 
        item.country=req.body.addresses.country 
        item.isDefault=req.body.addresses.isDefault
      }else if(req.body.addresses.isDefault===true){ 
         item.isDefault=false
      }
     })  
     user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { addresses: user.addresses } },
        { new: true, runValidators: true }
      );
      
    let userData = {
      name: user.name,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      addresses: user.addresses,
      phone: user.phone,
      role: user.role,
    };
    const {accessToken,refreshToken} =createJwtToken(req.user);  
    res
      .status(200)
      .json({
        message: "User updated successfully",
        success: true,
        rs: 200,
        accessToken,
        refreshToken,
        data: userData,
      });
  } catch (error) { 
  
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.deleteUserById=async(req,res)=>{
   try {
     let { id } = req.params;  
  
       let response = await User.findByIdAndDelete(id);
       if(response){
       const imgPublicId = response.imagePublicId
        if(imgPublicId){ 
           await deleteImageFromCloudinary(imgPublicId) 
        }
       res.status(200).json({"message":"User deleted successfully","success":true,"rs":200,"data":response})
      }else{
        res.status(400).json({"message":"User not found","success":false,"rs":400,"data":null})
      }
   } catch (error) {
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}

exports.deleteMultipleUserById=async(req,res)=>{
   try { 
     let { userIds } = req.body;   
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
          return res.status(400).json({ message: 'No user IDs provided for deletion.',"success":false,"rs":400,"data":null });
         }

         
       const deletedUsers = await User.find({_id:{$in:[...userIds]}});  
       let response = await User.deleteMany({_id:{$in:[...userIds]}}); 
       if (response.deletedCount === 0) {
         return res.status(404).json({ message: 'No users found with the provided IDs.',"success":false,"rs":404,"data":null });
        } 
       
       for(let user of deletedUsers){ 
         const imgPublicId = user.imagePublicId
         if(imgPublicId){ 
           await deleteImageFromCloudinary(imgPublicId) 
        }
       } 
       res.status(200).json({"message":`${response.deletedCount} users deleted successfully`,"success":true,"rs":200,"data":deletedUsers})
       
   } catch (error) { 
       res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
   }
    
}


exports.searchUserByName=async (req, res) => {
  try {
    const { qName } = req.query; 
    
    if (!qName) return  res.status(400).json({"message":"No search query find!","success":false,"rs":400,"data":null})


    const users = await User.aggregate([
      {
        $search: {
          index: "fuzzySearchUser", 
          autocomplete: {
            query: qName,
            path: "name",   // field to search
            fuzzy: { maxEdits: 1 } // allows small typos (optional)
          }
        }
      },
      { $limit: 10 }, // return only 10 results
      {
         $project: {
      _id: 1,
      name: 1, 
    }}
    ]);

     res.status(200).json({"message":"Users Searched","success":true,"rs":200,"data":users})
  } catch (error) {
   console.error(error);
   res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})

  }
};
