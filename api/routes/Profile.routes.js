import { Router } from "express";
import {
    createProfile,
    getProfile,
    updateProfile,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/my", getProfile);
router.post("/create", createProfile);
router.post("/update", updateProfile);

export default router;
