require('dotenv').config();
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;

if (!dbUri) {
  console.error('Error: MONGODB_URI is not set in your .env file.');
  process.exit(1);
}

// Mask connection string password for secure output
const maskedUri = dbUri.replace(/:([^:@]+)@/, ':******@');
console.log(`Connecting to: ${maskedUri}`);

mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('\n=========================================');
    console.log('  SUCCESS: Connected to MongoDB Atlas!  ');
    console.log('=========================================\n');
    process.exit(0);
  })
  .catch(err => {
    console.log('\n=========================================');
    console.log('  CONNECTION FAILED!                     ');
    console.log('=========================================\n');
    console.error('Error details:', err.message);
    
    console.log('\n--- Common Solutions ---');
    if (err.message.includes('queryTxt') || err.message.includes('ENOTFOUND') || err.message.includes('timeout')) {
      console.log('1. IP Access List (Whitelist): Check if your current IP is allowed on MongoDB Atlas.');
      console.log('   Go to Atlas -> Network Access -> Add IP Address -> Select "Allow Access From Anywhere (0.0.0.0/0)" for testing.');
    }
    if (err.message.includes('auth') || err.message.includes('Authentication failed')) {
      console.log('2. Incorrect Password/Username: Check your credentials in the connection string.');
      console.log('3. Special Characters: If your password has @, +, :, or / characters, URL-encode them:');
      console.log('   @ -> %40');
      console.log('   : -> %3A');
      console.log('   + -> %2B');
      console.log('   / -> %2F');
    }
    process.exit(1);
  });
