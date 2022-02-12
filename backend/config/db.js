import mongoose from 'mongoose';
import dotenv from 'dotenv';


const connectDB = async () => {
  dotenv.config();

  console.log(process.env.MONGO_URI)
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;