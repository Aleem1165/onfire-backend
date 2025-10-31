import { Router } from "express";
import { forgotPassword, resetPassword, signin, signup, verifyOtp } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import { forgotPasswordValidation, resetPasswordSchema, signinValidation, signupValidation, verifyOtpSchema } from "../validations/auth";

const router = Router()

router.post('/signup', validate(signupValidation), signup)
router.post('/signin', validate(signinValidation), signin)
router.post('/forgotPassword', validate(forgotPasswordValidation), forgotPassword)
router.post('/verifyOtp', validate(verifyOtpSchema), verifyOtp)
router.post('/resetPassword', validate(resetPasswordSchema), resetPassword)

export default router