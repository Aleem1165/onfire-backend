import { Router } from "express";
import upload from "../utils/multerConfig";
import { uploadImage, uploadMultipleImages } from "../controllers/upload";

const router = Router();

router.post("/single", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);

export default router;
