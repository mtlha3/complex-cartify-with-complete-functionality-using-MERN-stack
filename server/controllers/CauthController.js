import CUser from "../models/CUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import CLoginHistory from "../models/CLoginHistory.js"; 


// controller for signup for customers
export const signup = async (req, res) => {
  try {
    const {name, email, password} = req.body;


    const existingUser = await CUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const nextId = await CUser.incrementId();
    
    const user = new CUser({ Id: nextId, name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controller for login for customers
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await CUser.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
    
  

    const token = jwt.sign({ id: user.Id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: true,
      sameSite: "None",
    });
    

    const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const CloginHistory = new CLoginHistory({
      userId: user.Id, 
      email: user.email,
      ipAddress,
      userAgent,
    });

    await CloginHistory.save();

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controller for forgot password for customer side
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await CUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const emailSent = await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controller for verify otp at customer end
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await CUser.findOne({ email });
    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controller for reset password confirmation at customer end
export const resetPassword = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await CUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
