const jwt = require('jsonwebtoken');
require('dotenv').config();
const sanitizeUser = require('./common');

function createJwtToken(user) { 
      
    const {id,email,role}=sanitizeUser(user) 
    
    const accessToken=jwt.sign({id,email,role},
            process.env.JWT_PRIVATE_KEY,
          {expiresIn: '1m'},
          )
 
    const refreshToken=jwt.sign({id,email,role},
            process.env.JWT_PRIVATE_KEY,
          {expiresIn: '30d'},
          )   
          
   return {accessToken,refreshToken}       

}


module.exports=createJwtToken
