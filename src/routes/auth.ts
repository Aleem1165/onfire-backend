import { Router } from "express";
import { signin, signup } from "../controllers/auth";
import { validate } from "../middlewares/validate";
import { signinValidation, signupValidation } from "../validations/auth";

const router = Router()

router.post('/signup', validate(signupValidation), signup)
router.post('/signin', validate(signinValidation), signin)

export default router