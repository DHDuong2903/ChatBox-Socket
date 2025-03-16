const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://duongdo:duongdo@cluster3.w1ed9.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster3"
    );
    console.log("Ket noi thanh cong");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
