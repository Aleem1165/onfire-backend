import { Router } from "express";
import { IsAuth } from "../middlewares/isAuth";
import { getUser, updateProfile } from "../controllers/user";
import { validate } from "../middlewares/validate";
import { updateProfileValidation } from "../validations/user";

const router = Router()

router.get("/getUser", IsAuth, getUser);
router.put("/updateProfile", IsAuth, validate(updateProfileValidation), updateProfile);

export default router