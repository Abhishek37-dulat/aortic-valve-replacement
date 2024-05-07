const mongoose = require("mongoose");

const Connection = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Mongoose connection successfull");
  } catch (error) {
    console.log("Mongoose connection Error", error);
  }
};

module.exports = Connection;
