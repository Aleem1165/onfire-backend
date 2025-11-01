import mongoose, { Schema } from "mongoose";
import { ILike } from "../types";

const likeSchema = new Schema<ILike>({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    reaction: { type: String, enum: ["like", "love", "care", "haha", "wow", "sad", "angry"], required: true },
}, { timestamps: true }
);

likeSchema.index({ author: 1, post: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);
