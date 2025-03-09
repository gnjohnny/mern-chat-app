import { Router } from "express";
import {
    deleteMessage,
    getMessages,
    sendMessage,
    updateMessage,
} from "../controllers/messages.controller.js";

const router = Router();

router.get("/all/:id", getMessages);
router.post("/send/:id", sendMessage);
router.post("/update/:id", updateMessage);
router.delete("/delete/:id", deleteMessage);

export default router;
