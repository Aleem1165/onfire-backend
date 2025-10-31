import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

export const validate = (schema: ObjectSchema) => {
    
    return (req: Request, res: Response, next: NextFunction) => {
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
};