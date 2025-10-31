import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) && !req.is("application/json")) {
        return res.status(415).json({ success: false, message: "*Unsupported Media Type. Expected 'application/json'." });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ success: false, message: "*Request body cannot be empty." });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details[0].message
        res.status(400).json({
            success: false,
            message: errors,
            errors: error.details.map((d) => d.message),
        });
        return
    }


    next();
};
