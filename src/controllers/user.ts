import { Request, Response } from "express";
import { User } from "../models/user";
import { sanitizeUser } from "../utils/sanitizeUser";
import { getUserPopulateOption } from "../utils/populateOptions";

export const getUser = async (req: Request, res: Response) => {
    try {
        const _id = req._id
        if (!_id) {
            res.status(400).json({ success: false, message: "*User ID is required" });
            return
        }

        const user = await User.findById(_id).populate(getUserPopulateOption);
        if (!user) {
            res.status(404).json({ success: false, message: "*User not found" });
            return
        }

        const cleanUser = sanitizeUser(user)

        res.status(200).json({
            success: true, message: "User fetched successfully", user: cleanUser
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const _id = req._id
        const { name, dateOfBirth, countryCode, phoneNumber } = req.body

        if (!_id) {
            res.status(400).json({ success: false, message: "*User ID is required" });
            return
        }

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "*User not found" });
            return;
        }

        user.name = name;
        user.dateOfBirth = dateOfBirth;
        user.countryCode = countryCode;
        user.phoneNumber = phoneNumber;

        await user.save();

        const cleanUser = sanitizeUser(user, { remove: ["eventsCreated", "posts", "eventsJoined"] })

        res.status(200).json({
            success: true, message: "Profile updated successfully", user: cleanUser,
        });


    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}
