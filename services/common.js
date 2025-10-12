
export const sanitizeUser = function sanitizeUser(user) {
    if(user){
        return {id:user.id,email:user.email,role:user.role}
    }
}

export const cookieHearderExtractor=(req,res)=>{ 
     
    console.log('cookies:--', req.cookies);
       if(req.headers.authorization){ 
        return req.headers.authorization.split(" ")[1]
       }
       if(req.cookies){    

         return  req.cookies.accessToken
       } 
       return ""
}

export const isAuth=(req,res,done)=>{
   passport.authenticate('jwt',{ session: false })
}