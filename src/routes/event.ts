import { Router } from "express";
import { IsAuth } from "../middlewares/isAuth";
import { createEvent, getEvents, joinEvent, updateEvent } from "../controllers/event";
import { validate } from "../middlewares/validate";
import { createEventValidation } from "../validations/event";

const router = Router()

router.post("/create", IsAuth, validate(createEventValidation), createEvent);
router.put("/update/:eventId", IsAuth, validate(createEventValidation), updateEvent);
router.post("/join/:eventId", IsAuth, joinEvent);
router.get("/all", IsAuth, getEvents);
router.get("/:eventId", IsAuth, getEvents);

export default router