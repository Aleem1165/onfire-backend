import mongoose from "mongoose";
import { IPost } from "./post";

export interface IUser extends Document {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    dateOfBirth: string;
    countryCode: string;
    phoneNumber: string;
    password?: string;
    role: string;
    otpCode?: string;
    otpExpiresAt?: Date;
    posts: (mongoose.Types.ObjectId | IPost)[];
}