import mongoose from "mongoose";

export interface IEvent extends mongoose.Document {
    name: string;
    cover: string;
    date: string;
    time: string;
    location: string;
    amount: number;
    about: string;
    createdBy: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
