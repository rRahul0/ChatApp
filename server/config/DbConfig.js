import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed");
        console.log(error);
        process.exit(1);
    }
    };
