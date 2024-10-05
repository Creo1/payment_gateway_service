const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    mongoUri: process.env.MONGO_DEV_CONNECTION_STRING,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    port: process.env.PORT
  },
  production: {
    mongoUri: process.env.MONGO_PROD_CONNECTION_STRING,
    port: process.env.PORT,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  },
};
