import Joi from "joi";

export const createPostValidation = Joi.object({
  content: Joi.string().trim().required().messages({
    "string.empty": "*Content is required",
  }),

  images: Joi.array()
    .items(
      Joi.string()
        .uri()
        .message("*Each image must be a valid URL")
    )
    .min(1)
    .required()
    .messages({
      "array.min": "*At least one image is required",
      "any.required": "*Images field is required",
    }),
});

export const likeValidation = Joi.object({
  reaction: Joi.string()
    .valid("like", "love", "care", "haha", "wow", "sad", "angry")
    .required()
    .messages({
      "any.required": "*Reaction is required",
      "any.only": "*Invalid reaction type",
    }),
});

export const commentValidation = Joi.object({
  content: Joi.string().trim().min(1).required().messages({
    "string.empty": "*Comment content is required",
    "string.min": "*Comment content cannot be empty",
    "any.required": "*Content field is required",
  }),
});
