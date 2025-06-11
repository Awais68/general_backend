import mongoose from "mongoose";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("DB is already connected.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DataBase is Connected.");
  } catch (err) {
    console.log("Failed to connect DB", err.message);
  }
};

export default connectToDB;
