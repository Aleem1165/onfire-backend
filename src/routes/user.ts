import { Router } from "express";
import { IsAuth } from "../middlewares/isAuth";
import { getUser } from "../controllers/user";

const router = Router()

router.get("/getUser", IsAuth, getUser);

export default router