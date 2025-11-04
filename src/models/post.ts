import mongoose, { Schema } from "mongoose"
import { IPost } from "../types";

const postSchema = new Schema<IPost>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, trim: true, required: true },
        images: { type: [String], default: [], required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "Like", default: [], }],
        comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
        sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null , index: true },
        sharedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        originalDeleted: { type: Boolean, default: false, },
    },
    { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", postSchema);

postSchema.set("toJSON", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});

postSchema.set("toObject", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});
