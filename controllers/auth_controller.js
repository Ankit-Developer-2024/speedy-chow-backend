const { User } = require("../models/user_model");
const bcrypt = require('bcryptjs')


exports.signUp= async(req,res)=>{
    
    try {
      const {name,email,password}=req.body;
      
      if(name.trim().length==0){
          res.status(400).json({"message":"Name is missing","success":false,"rs":400,"data":null})
      }
      else if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){      
         res.status(400).json({"message":"Enter a vaild Email","success":false,"rs":400,"data":null})
      }
      else if(!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)) {
            res.status(400).json({"message":"Enter a vaild Passsword","success":false,"rs":400,"data":null})
      }else{
       const user = new User({name,email,password});
       const response = await user.save();
       res.status(400).json({"message":"User successfully created","success":true,"rs":201,"data":response})
      
      }
    } catch (error) { 
      res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
    }
    
   
}

exports.login=async(req,res)=>{
    try {
         const {email,password}=req.body;
    
      if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){      
         res.status(400).json({"message":"Enter a vaild Email","success":false,"rs":400,"data":null})
      }else{
         const user =  await User.findOne({email});
         if(user){
           let response = await bcrypt.compare(password, user.password);
           if (response) {
              let userData={
                name:user.name,
                email:user.email,
                dob:user.dob,
                gender:user.gender,
                phone:user.phone,
                role:user.role
              } 
              res.status(200).json({"message":"User find successfully","success":true,"rs":200,"data":userData})
           }else{
              res.status(400).json({"message":"Enter wrong credentials","success":false,"rs":400,"data":null})
           }
         }else{
           res.status(400).json({"message":"Enter wrong credentials","success":false,"rs":400,"data":null})
         }
      }
    } catch (error) {
       res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
    }
}

exports.resetPasswordRequest=async(req,res)=>{

    try {
        let {email}=req.body;     
        const user=await User.findOne({email});
        if(user){
            //send email with otp

        }else{
            res.status(400).json({"message":"User not found","success":false,"rs":400,"data":null})
        }   
    } catch (error) {
        res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
    }

}
 
exports.resetPassword=async(req,res)=>{
    try {
        let {email,password,otp}=req.body
        
        let user=await User.findOne({email,resetPasswordOtp:otp})
        if(user){  
          user.password=password;
          user= await user.save();
          //optinal send email for sucessfullty change password email

           res.status(200).json({"message":"Password change sucessfully","success":true,"rs":200,"data":null})
          
        }else{
          res.status(400).json({"message":"User not found","success":false,"rs":400,"data":null})
        }
        
    } catch (error) {
        res.status(500).json({"message":error,"success":false,"rs":500,"data":null})
    }
}