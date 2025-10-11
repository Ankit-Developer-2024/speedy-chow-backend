const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log("DB error:",err));

async function main() {    
    
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("mongodb connected");
  
}