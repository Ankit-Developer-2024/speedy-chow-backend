const { User } = require("../models/user_model");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {createJwtToken, sendOtpMail} = require("../services/global_services");
const { sanitizeUser } = require("../services/common");

exports.signUp = async (req, res) => {
  try { 
    
    const { name, email, password } = req.body;

    if (name.trim().length == 0) {
      res
        .status(400)
        .json({
          message: "Name is missing",
          success: false,
          rs: 400,
          data: null,
        });
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      res
        .status(400)
        .json({
          message: "Enter a vaild Email!",
          success: false,
          rs: 400,
          data: null,
        });
    } else if (
      !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ) {
      res
        .status(400)
        .json({
          message: "Enter a vaild Passsword!",
          success: false,
          rs: 400,
          data: null,
        });
    } else {
      const user = new User({ ...req.body });
      const response = await user.save();
      if (response) {
        const sanUser = sanitizeUser(response);
        const { accessToken, refreshToken } = createJwtToken(sanUser);
        res.cookie("accessToken", accessToken, {
          maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
          httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
          secure: true, // Sends the cookie only over HTTPS
          sameSite: "None", // IMPORTANT: allows cross-site cookie sharing
        });
        const maxAgeMilliseconds = 30 * 24 * 60 * 60 * 1000;
        res.cookie("refreshToken", refreshToken, {
          maxAge: maxAgeMilliseconds,
          httpOnly: true,
          secure: true,
          sameSite: "None", 
        });

        res
          .status(201)
          .json({
            message: "Account successfully created!",
            success: true,
            rs: 201,
            accessToken,
            refreshToken,
            data: { ...sanUser },
          });
      } else {
        res
          .status(400)
          .json({
            message: "Something went wrong",
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

exports.login = async (req, res) => {
  try { 
  
    const sanUser = sanitizeUser(req.user);
    res
      .status(200)
      .json({
        message: "Login successfully!",
        success: true,
        rs: 200,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
        data: { ...sanUser },
      });

    /*************login code without passport*************/
    // if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
    //    res.status(200).json({"message":"Enter a vaild Email","success":false,"rs":400,"data":null})
    // }else{
    //    const user =  await User.findOne({email});
    //    if(user){
    //      let response = await bcrypt.compare(password, user.password);
    //      if (response) {
    //           const {accessToken,refreshToken} =createJwtToken(user);
    //           const userInfo=sanitizeUser(user);
    //         res.status(200).json({"message":"User find successfully","success":true,"rs":200,accessToken,refreshToken,"data":{...userInfo}})
    //      }else{
    //         res.status(400).json({"message":"Enter wrong credentials","success":false,"rs":400,"data":null})
    //      }
    //    }else{
    //      res.status(200).json({"message":"Enter wrong credentials","success":false,"rs":400,"data":null})
    //    }
    // }
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.webLogin = async (req, res) => {
  try { 
    if(req.user.role!=='admin'){
       return  res
      .status(400)
      .json({
        message: "You are not admin user!",
        success: false,
        rs: 400, 
        data: null,
      });
    }
    
    res.cookie("accessToken", req.user.accessToken, {
      maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: true, // Sends the cookie only over HTTPS
      sameSite: "None", // Controls when the cookie is sent with cross-site requests
    });
    const maxAgeMilliseconds = 30 * 24 * 60 * 60 * 1000;
    res.cookie("refreshToken", req.user.refreshToken, {
      maxAge: maxAgeMilliseconds,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    const sanUser = sanitizeUser(req.user);
    res
      .status(200)
      .json({
        message: "Login successfully!",
        success: true,
        rs: 200,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
        data: { ...sanUser },
      });

  } catch (error) { 
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  try {
    let { email } = req.body;
    const user = await User.findOne({email});
    if (user) {
      //send email of otp and save 4 digiet otp to db
       const otp=Math.floor(Math.random() * 10000)
       const time=Date.now()+(10*60*1000);
       await User.findByIdAndUpdate(user.id,{resetPasswordOtp:otp,otpValidUntil:time})
       sendOtpMail(user.email,otp,time)
       res
        .status(200)
        .json({
          message: "User found!",
          success: true,
          rs: 200,
          data: {success:true},
        });
    } else {
      res
        .status(404)
        .json({
          message: "User not found!",
          success: false,
          rs: 404,
          data: {success:false},
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.verifyOtp= async(req,res)=>{
    try {
    let { email, otp } = req.body;
    let user = await User.findOne({ email, resetPasswordOtp: otp });
    if (user) { 
      let time= Date.now()
      if(user.resetPasswordOtp===otp && time<=user.otpValidUntil){
        res
        .status(200)
        .json({
          message: "Otp verified!",
          success: true,
          rs: 200,
          data: {verify:true},
        });
      }else{
         res
        .status(200)
        .json({
          message: "Wrong Otp!",
          success: false,
          rs: 200,
          data: {verify:false},
        });
      }
     
    } else {
       res
        .status(200)
        .json({
          message: "Wrong Otp!",
          success: false,
          rs: 200,
          data: {verify:false},
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email});
    if (user) {
      user.password = password;
      user = await user.save();
      //optinal send email for sucessfullty change password email

      res
        .status(200)
        .json({
          message: "Password changed sucessfully!",
          success: true,
          rs: 200,
          data: {success:true},
        });
    } else {
      res
        .status(200)
        .json({
          message: "Password not changed sucessfully!",
          success: true,
          rs: 200,
          data: {success:false},
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    let token = req.cookies.refreshToken; 
    if (!token) {
      if(req.headers.authorization){
         token = req.headers.authorization.split(' ')[1]
      }
      
    }
    
    if (!token) { 
      
     return  res
        .status(400)
        .json({
          message: "Token not found!",
          success: false,
          rs: 400,
          data: null,
        }); 
    }
    let result = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
     
    if (!result && !result.email) {
     return res
        .status(403)
        .json({
          message: "Unauthorized:Invalid token!",
          success: false,
          rs: 403,
          data: null,
        });
    }
    req.user = result;
    const { accessToken, refreshToken } = createJwtToken(req.user);
    res.cookie("accessToken", accessToken, {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    const maxAgeMilliseconds = 30 * 24 * 60 * 60 * 1000;
    res.cookie("refreshToken", refreshToken, {
      maxAge: maxAgeMilliseconds,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    }); 
    res
      .status(200)
      .json({
        message: "Token generated successfully",
        success: true,
        rs: 200,
        accessToken,
        refreshToken,
        data: { isVerify: true },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    res.cookie("accessToken", req.user.accessToken, {
      maxAge: 3600000, // Cookie expires in 1 hour (in milliseconds)
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: true, // Sends the cookie only over HTTPS
      sameSite: "None", // Controls when the cookie is sent with cross-site requests
    });
    const maxAgeMilliseconds = 30 * 24 * 60 * 60 * 1000;
    res.cookie("refreshToken", req.user.refreshToken, {
      maxAge: maxAgeMilliseconds,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res
      .status(200)
      .json({
        message: "Authorizated:Token generated successfully!",
        success: true,
        rs: 200,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
        data: { isVerify: true },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

exports.checkUser = async (req, res) => {
  try {
    res
      .status(200)
      .json({
        message: "Authorizated:User verify",
        success: true,
        rs: 200, 
        data: { isVerify: true },
      });
  } catch (error) { 
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};


exports.signOut = async (req,res) =>{
  try {
    res.clearCookie('accessToken')
     res.clearCookie('refreshToken')
       res
      .status(200)
      .json({ message: "Sign Out successfully!", success: true, rs: 200, data: null });
  
  } catch (error) {
      res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
}