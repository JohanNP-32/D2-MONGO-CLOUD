const mongose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongose.connect(process.env.MONGO_URI),
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;