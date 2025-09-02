import mongoose from "mongoose";
//it connect your backend with your mongo database
const connectDB = async () => { 
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)  
 

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); 
  }
};

export default connectDB;