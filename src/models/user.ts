import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    dateOfBirth: { type: String, require: true },
    countryCode: { type: String, require: true },
    phoneNumber: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
}, { timestamps: true })

export const User = mongoose.model<IUser>("User", UserSchema)