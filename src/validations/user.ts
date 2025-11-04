import Joi from "joi";

export const updateProfileValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "*Name is required",
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

});