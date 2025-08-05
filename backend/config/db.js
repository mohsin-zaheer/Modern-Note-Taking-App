// db.js
import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI);
    const conn = await mongoose.connect("mongodb+srv://mohsinzaheerbabar:i8u9DH42J4AQm5yr@cluster0.xc7kzwn.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0");

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
