import mongoose from "mongoose"
import { dbUrl } from "./env";

export const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl as string)
        console.log("DB connected!");

    } catch (error) {
        console.log("DB connecting error:", error);
        process.exit(1)
    }
}