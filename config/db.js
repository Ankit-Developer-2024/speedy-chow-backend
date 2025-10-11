const mongoose = require('mongoose');
require('dotenv').config()

// main().catch(err => console.log("DB error:",err));

// async function main() {    
    
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log("mongodb connected");
  
// } 
const connection = {};

async function dbConnect() {
  // If we have a connection, return it and avoid creating a new one
  if (connection.isConnected) {
    console.log('Using existing database connection');
    return;
  }

  // Use new connection
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.isConnected = db.connections[0].readyState;
    console.log('New database connection established');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
}

module.exports = dbConnect;
