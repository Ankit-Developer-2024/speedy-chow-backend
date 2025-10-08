const jwt = require('jsonwebtoken');
const { sanitizeUser } = require('./common');
const { createHmac } = require('node:crypto');
const emailjs=require('../config/emailJs_config')
require('dotenv').config(); 

function createJwtToken(user) { 
      
    const {id,email,role}=sanitizeUser(user) 
    
    const accessToken=jwt.sign({id,email,role},
            process.env.JWT_PRIVATE_KEY,
          {expiresIn: '1h'},
          )
 
    const refreshToken=jwt.sign({id,email,role},
            process.env.JWT_PRIVATE_KEY,
          {expiresIn: '30d'},
          )   
          
   return {accessToken,refreshToken}       

}

function validatePaymentVerification(orderId,paymentId,paymentSignature ) { 
  const generated_signature  = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
               .update(orderId + "|" + paymentId)
               .digest('hex');

   return generated_signature === paymentSignature            
}

 async function sendOrderConfirmationMail(email,orderId,paymentId){
  try {
    let templateParams;
    if(paymentId.length===0){
    templateParams= {
        'email':email,
        'info_subject': `Your Order Confirmation – Order id #${orderId}.`,
        'code':`Your Order id is #${orderId}.`,
        'heading': 'Thank you for your order!',
        "info1":"Sit back and relax! Your order is confirmed and will be on its way soon.",
        "info2":"If you have any questions, feel free to reply to this email or contact our support team."
    };
    
    }else{

    templateParams= {
        'email':email,
        'info_subject': `Your Order Confirmation – Order id #${orderId}.`,
        'code':`Your Order id is #${orderId} and Payment id #${paymentId}.`,
        'heading': 'Thank you for your order!',
        "info1":"Sit back and relax! Your order is confirmed and will be on its way soon.",
        "info2":"If you have any questions, feel free to reply to this email or contact our support team."
    }
    
    }
     
   emailjs .send(process.env.EMAIL_SERVICE_ID, process.env.EMAIL_TEMPLATE_ID, templateParams)
     .then(
    (response) => { 
      // console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
     // console.log('FAILED...', err);
    },
  );
  } catch (error) {
   // console.log(error);
    
  }
}

 async function sendOtpMail(email,otp,time){
  try {
    let templateParams; 
    templateParams= {
        'email':email,
        'info_subject': "Your OTP for Password Reset – Valid for 10 Minutes.",
        'heading': 'To authenticate, please use the following One Time Password (OTP):',
        'code':otp,
        "info1":`This OTP will be valid for 10 minutes till ${(new Date(time)).toDateString() + " , " + (new Date(time)).toTimeString()}`,
        "info2":"Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email. Speedy Chow will never contact you about this email or ask for any login codes or links. Beware of phishing scams."
    };
     
   emailjs .send(process.env.EMAIL_SERVICE_ID, process.env.EMAIL_TEMPLATE_ID, templateParams)
     .then(
    (response) => { 
      // console.log('SUCCESS!', response.status, response.text);
    },
    (err) => {
     // console.log('FAILED...', err);
    },
  );
  } catch (error) {
   // console.log(error);
    
  }
}



module.exports={createJwtToken,validatePaymentVerification,sendOrderConfirmationMail,sendOtpMail}
