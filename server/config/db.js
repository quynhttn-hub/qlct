const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Lỗi ở: ${error.message}`.red.bold);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;

