import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      (process.env.MONGODB_URI =
        "mongodb+srv://UBU10:Nothing@adhd.a60okvl.mongodb.net/"),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);

    process.exit(1);
  }
};

export default connectDB;
