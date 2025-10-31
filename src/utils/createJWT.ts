import Jwt from "jsonwebtoken";
import { jwtSecret } from "../config/env";

export const createJWT = async (payload: { _id: string; email: string, role: string }) => {
    try {
        const token = await Jwt.sign(payload, jwtSecret as string)
        return token
    } catch (error) {
        return error
    }
}