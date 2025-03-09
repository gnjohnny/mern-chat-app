import { Router } from "express";
import {
    getAllUsers,
    getAuthUser,
    logIn,
    logOut,
    Register,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../utils/checkAuth.utils.js";

const router = Router();

router.get("/user", checkAuth, getAuthUser);
router.get("/all-users", checkAuth, getAllUsers);
router.post("/register", Register);
router.post("/login", logIn);
router.post("/logout", logOut);

export default router;
