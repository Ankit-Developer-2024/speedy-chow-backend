const { User } = require("../models/user_model");

exports.fetchUser = async (req, res) => {
  try {
    let { id } = req.user;

    let user = await User.findById(id);
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
          data: userData,
        });
    } else {
      res
        .status(400)
        .json({
          message: "User not found",
          success: true,
          rs: 400,
          data: null,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};

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
        gender: user.gender,
        addresses: user.addresses,
        phone: user.phone,
        role: user.role,
      };
      res.status(200) .json({
          message: "User updated successfully",
          success: true,
          rs: 200,
          data: userData,
        });
    } else {
      let user = await User.findByIdAndUpdate( id,{ ...req.body },{ new: true });
      let userData = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
        addresses: addresses,
        phone: user.phone,
        role: user.role,
      };
      res
        .status(200)
        .json({
          message: "User updated successfully",
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
};

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
    res
      .status(200)
      .json({
        message: "User updated -successfully",
        success: true,
        rs: 200,
        data: userData,
      });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: String(error), success: false, rs: 500, data: null });
  }
};
