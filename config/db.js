const mongoose = require('mongoose');
require('dotenv').config()
let isConnected = false;

// main().catch(err => console.log("DB",err));

const connectDB =async function main() {   
   try{ 
    if(isConnected) return;
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  );  
  isConnected=true
  console.log("mongodb connected");
}catch(err){
  console.log("DB error",err);
  
}
  
}
connectDB()

module.exports = connectDB;
