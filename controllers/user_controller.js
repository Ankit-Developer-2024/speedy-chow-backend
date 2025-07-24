const { User } = require("../models/user_model")

exports.fetchUserById=async(req,res)=>{
    try {
        let {id}=req.params

        let user=await User.findById(id);
        if (user) {
             let userData={
                name:user.name,
                email:user.email,
                dob:user.dob,
                gender:user.gender,
                phone:user.phone,
                role:user.role
              } 
         res.status(200).json({"message":"User fetch successfully","success":true,"rs":200,"data":userData})
        } else{
         res.status(400).json({"message":"User not found","success":true,"rs":400,"data":null})
        }       
    } catch (error) {
        res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
      }
}

exports.updateUser=async(req,res)=>{
     try {
        let {id}=req.params

         let user=await User.findByIdAndUpdate(id,req.body,{new:true});
         let userData={
                name:user.name,
                email:user.email,
                dob:user.dob,
                gender:user.gender,
                phone:user.phone,
                role:user.role
              } 
         res.status(200).json({"message":"User updated successfully","success":true,"rs":200,"data":userData})
     } catch (error) {
           res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
     }


}