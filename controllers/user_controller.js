const { User } = require("../models/user_model");


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

 

