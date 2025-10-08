const emailjs = require('@emailjs/nodejs')
require('dotenv').config(); 

// set Public Key as global settings
emailjs.init({
  publicKey: process.env.EMAIL_PUBLIC_ID,
  privateKey: process.env.EMAIL_PRIVATE_ID,  
});

module.exports=emailjs