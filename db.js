const mongoose = require('mongoose');
require('dotenv').config()

main().catch(err => console.log(err));

async function main() {    
    
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("mongodb connected");
  
}
