import { Request, Response } from "express";
import { toLowerEmail } from "../utils/toLowerEmail";
import { User } from "../models/user";
import { createHashedPassword } from "../utils/createHashedPassword";
import { createJWT } from "../utils/createJWT";
import { verifyHashedPass } from "../utils/verifyHashedPass";
import { sanitizeUser } from "../utils/sanitizeUser";
import { createOtp } from "../utils/createOtp";
import { sendForgotPasswordEmail } from "../utils/sendForgotPasswordEmail";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, dateOfBirth, countryCode, phoneNumber, password, role } = req.body

        const lowerEmail = toLowerEmail(email)

        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser) {
            res.status(400).json({
                message: "*An account with this email already exists.", success: false,
            });
            return;
        }

        const hashedPass = await createHashedPassword(password);

        const newUser = await User.create({
            name, email: lowerEmail, dateOfBirth,
            countryCode, phoneNumber, password: hashedPass, role
        })

        const obj = {
            _id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role
        }

        const token = await createJWT(obj);

        const cleanUser = sanitizeUser(newUser)

        res.status(201).json({ message: "Signup successfully", success: true, user: cleanUser, token });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const lowerEmail = toLowerEmail(email)

        const user = await User.findOne({ email: lowerEmail })

        if (!user) {
            res.status(400).json({
                message: "*No account found with this email address.", success: false,
            });
            return;
        }

        const hashedPass = user.password
        const verifyPass = await verifyHashedPass(password, hashedPass!)
        if (!verifyPass) {
            res.status(400).json({ message: "*Incorrect password.", success: false });
            return;
        }

        const obj = {
            _id: user._id.toString(),
            email: user.email,
            role: user.role
        }

        const token = await createJWT(obj);

        const cleanUser = sanitizeUser(user, { remove: ["posts" , "eventsJoined" , "eventsCreated"] })

        res.status(200).json({ message: "Signin successfully", success: true, user: cleanUser, token });

    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const lowerEmail = toLowerEmail(email);
        const user = await User.findOne({ email: lowerEmail })
        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false,
            });
            return;
        }
        const OTP = await createOtp();
        user.otpCode = OTP;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save();
        await sendForgotPasswordEmail({ to: lowerEmail, subject: "Your OTP Code", otp: OTP, name: user?.name, });
        res.status(200).json({ message: "Email send successfully.", success: true });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body

        const lowerEmail = toLowerEmail(email);

        const user = await User.findOne({ email: lowerEmail });

        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false,
            });
            return;
        }

        if (user.otpCode !== otp) {
            res.status(400).json({ message: "*Invalid OTP code.", success: false });
            return;
        }

        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            res.status(400).json({
                message: "*OTP has expired. Please request a new one.", success: false,
            });
            return;
        }
        res.status(200).json({ message: "OTP has been successfully verified.", success: true });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false, message: "*Password and Confirm Password do not match.",
            });
        }

        const lowerEmail = toLowerEmail(email);

        const user = await User.findOne({ email: lowerEmail });

        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false,
            });
            return;
        }

        const hashedPasword = await createHashedPassword(password);

        await User.findByIdAndUpdate(
            { _id: user?._id },
            { password: hashedPasword, otpCode: "", otpExpiresAt: null },
            { new: true }
        );
        res.status(200).json({
            message: "*Your password has been changed successfully.", success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}