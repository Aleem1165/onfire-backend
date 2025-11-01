import mongoose, { Document } from "mongoose";
import { IUser } from "./user";

export interface IPost extends Document {
    author: mongoose.Types.ObjectId | IUser;
    content: string;
    images: string[];
    likes: mongoose.Types.ObjectId[];
    comments: mongoose.Types.ObjectId[];
    // shares: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
