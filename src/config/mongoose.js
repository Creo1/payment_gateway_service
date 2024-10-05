const mongoose = require("mongoose");
const config = require('./config');

mongoose
  .connect(config.development.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

module.exports = mongoose;
