import Joi from "joi";

export const createEventValidation = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "*Name is required",
        "string.min": "*Name must be at least 3 characters long",
        "string.max": "*Name cannot exceed 100 characters",
        "any.required": "*Name is required",
    }),

    cover: Joi.string().uri().required().messages({
        "string.empty": "*Cover image URL is required",
        "string.uri": "*Cover must be a valid URL",
        "any.required": "*Cover image is required",
    }),

    date: Joi.string().required().messages({
        "string.empty": "*Date is required",
        "any.required": "*Date is required",
    }),

    time: Joi.string()
        .required()
        .messages({
            "string.empty": "*Time is required",
            "any.required": "*Time is required",
        }),

    location: Joi.string()
        .required()
        .messages({
            "string.empty": "*Location is required",
            "any.required": "*Location is required",
        }),

    amount: Joi.number()
        .required()
        .min(0)
        .messages({
            "any.required": "*Amount is required",
            "number.min": "*Amount cannot be negative",
        }),

    about: Joi.string()
        .required()
        .messages({
            "string.empty": "*About is required",
            "any.required": "*About is required",
        }),
});
