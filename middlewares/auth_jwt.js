const jwt = require('jsonwebtoken'); 
 
function authJwt(req,res,next) {
    try { 
        const authHeader=req.headers.authorization  
        
    if(!authHeader){
        res.status(401).json({"message":"Unauthorized:Token not found","success":false,"rs":401,"data":null})
        return
    }
     
    const token=authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_PRIVATE_KEY,(err, user) => {
            if (err) {
                res.status(401).json({ "message": "Unauthorized:Invalid token", "success": false, "rs": 401, "data": null });
                return;
            }
            req.user = user;
            next();
        });
    
    } catch (error) { 
        res.status(500).json({"message":String(error),"success":false,"rs":500,"data":null})
    
    } 
}

module.exports=authJwt