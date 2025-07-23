import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users can access register
router.post("/register",verifyToken, registerUser);
// Login route
router.post("/login", loginUser);

export default router;
