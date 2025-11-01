import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}