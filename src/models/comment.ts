import mongoose, { Schema } from "mongoose";
import { IComment } from "../types";

const commentSchema = new Schema<IComment>({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    content: { type: String, required: true },
}, { timestamps: true });

commentSchema.set("toJSON", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});

commentSchema.set("toObject", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
