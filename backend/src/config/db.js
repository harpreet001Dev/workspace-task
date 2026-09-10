import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
      return;
    } catch (error) {
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${maxRetries}):`,
        error.message
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;