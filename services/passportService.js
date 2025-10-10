const passport = require("passport");
require('dotenv').config()
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {User} = require("../models/user_model");
const bcrypt = require("bcryptjs");
const { cookieHearderExtractor, sanitizeUser } = require("./common");
const {createJwtToken} = require("./global_services"); 


let opts = {};
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieHearderExtractor]);
opts.secretOrKey = process.env.JWT_PRIVATE_KEY

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async (email, password, cb) => {
    try { 
      
      let user = await User.findOne({ email }); 
      
      if (!user) {
        return cb(null, false, { message: "Wrong credentials!" });
      }
      if(user.status==="Block" || user.status==="Delete" ){
        return cb(null, false, { message: "User not found!" });
      }

      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) { 
        return cb(null, false, { message: "Wrong credentials!" });
      }
      const sanUser = sanitizeUser(user); 
      const { accessToken, refreshToken } = createJwtToken(sanUser); 
      return cb(null, { ...sanUser, accessToken, refreshToken });
    } catch (error) {  
      cb(error);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, cb) {
    try {    
      const user = await User.findOne({ email: jwt_payload.email }).exec();
      
      if (user) {
        const sanUser = sanitizeUser(user); 
        return cb(null, { ...sanUser});
      } else {  
        return cb(null, false);
      } 
    } catch (err) {   
      return cb(err);
    }
  })
);

module.exports = passport;
