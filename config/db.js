const mongoose = require('mongoose');
require('dotenv').config()
let isConnected = false;

// main().catch(err => console.log("DB",err));

const connectDB =async function main() {    
    if(isConnected) return;
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  );  
  isConnected=true
    console.log("mongodb connected");
  
}

module.exports = connectDB;