import mongoose from "mongoose";
import {DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const mongoConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: ${mongoConnect.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error has happended:");
        process.exit(1);
    }
};

export default connectDB;
