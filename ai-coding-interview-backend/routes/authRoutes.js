import express from "express";
import { signupUser, loginUser, getProfile } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile); // Ensure getProfile is correctly passed as a function

export default router;
