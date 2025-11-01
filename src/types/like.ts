import mongoose, { Document } from "mongoose";

export interface ILike extends Document {
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    reaction: "like" | "love" | "care" | "haha" | "wow" | "sad" | "angry";
    createdAt?: Date;
    updatedAt?: Date;
}