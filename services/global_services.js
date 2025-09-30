const jwt = require('jsonwebtoken');
const { sanitizeUser } = require('./common');
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


module.exports=createJwtToken
