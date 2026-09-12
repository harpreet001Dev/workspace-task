import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;

  const mongoUri =
    process.env.MONGO_URI ||
    "mongodb://mongodb:27017/workspace?directConnection=true";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(mongoUri);
      console.log("MongoDB connected");

      // Auto-initiate replica set rs0 if not already initialized (required for transactions)
      try {
        const admin = mongoose.connection.db.admin();
        await admin.command({ replSetInitiate: {} });
        console.log("Replica set rs0 initialized");
      } catch {
        // Silently ignore if already initialized or standalone
      }

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