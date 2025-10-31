import dotenv from "dotenv"
dotenv.config()

export const port = process.env.PORT || 5000;
export const dbUrl = process.env.DB_URL;
export const jwtSecret = process.env.JWT_SECRET
export const nodemailerUser = process.env.NODEMAILER_USER
export const nodemailerPass = process.env.NODEMAILER_PASSWORD