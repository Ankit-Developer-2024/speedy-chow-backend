
function sanitizeUser(user) {
    if(user){
        return {id:user.id,email:user.email,role:user.role}
    }
}


module.exports=sanitizeUser