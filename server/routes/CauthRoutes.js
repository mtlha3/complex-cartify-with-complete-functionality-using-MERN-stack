import express from "express";
import { signup, login, forgotPassword, verifyOTP, resetPassword, checkAuthStatus, logout } from "../controllers/CauthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/status", checkAuthStatus);
router.post("/logout", logout);


export default router;
