import Joi from "joi";

export const signupValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "*Name is required",
    }),

    email: Joi.string().email().required().messages({
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),

    dateOfBirth: Joi.date().less("now").required().messages({
        "string.empty": "*Date of birth is required",
        "date.less": "*Date of birth must be in the past",
    }),

    countryCode: Joi.string().pattern(/^\+\d{1,4}$/).required().messages({
        "string.pattern.base": "*Country code must start with '+' followed by digits",
    }),

    phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
        "string.empty": "*Phone number is required",
        "string.pattern.base": "*Phone number must be between 7 and 15 digits",
    }),

    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "*Password is required",
        "string.min": "*Password must be at least 6 characters long",
    }),

    role: Joi.string().valid("user", "trainer").required().messages({
        "string.empty": "*Role is required",
        "any.only": "*Role must be either 'user' or 'trainer'",
    }),
});

export const signinValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),

    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "*Password is required",
        "string.min": "*Password must be at least 6 characters long",
    }),
});

export const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
    otp: Joi.alternatives().try(Joi.string().trim(), Joi.number()).required().messages({
        "string.empty": "*OTP is required.",
        "any.required": "*OTP is required.",
    }),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
    password: Joi.string().min(6).max(30).required().messages({
        "string.empty": "*Password is required",
        "string.min": "*Password must be at least 6 characters long",
    }),
    confirmPassword: Joi.string().min(6).max(30).required().messages({
        "string.empty": "*Confirm Password is required",
        "string.min": "*Confirm Password must be at least 6 characters long",
    }),
});
