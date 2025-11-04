import mongoose from "mongoose";
import { IEvent } from "../types";

const eventSchema = new mongoose.Schema<IEvent>({
    name: { type: String, required: true },
    cover: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String },
    location: { type: String },
    amount: { type: Number },
    about: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
}, { timestamps: true });

export const Event = mongoose.model<IEvent>("Event", eventSchema);

eventSchema.set("toJSON", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});

eventSchema.set("toObject", {
    transform: function (doc, ret: any) {
        delete ret.__v;
        return ret;
    },
});
