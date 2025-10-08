require('dotenv').config()
const Razorpay = require('Razorpay')

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//console.log(razorpayInstance.api);

module.exports=razorpayInstance