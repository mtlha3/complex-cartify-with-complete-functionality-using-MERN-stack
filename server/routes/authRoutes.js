import express from "express";
import { signup, login, forgotPassword, verifyOTP, resetPassword, getStoreNamesAndImages } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.get("/store-info",getStoreNamesAndImages)

export default router;
