import express from "express";
import { loginUser, registerUser,validateUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users can access register
router.post("/register",verifyToken, registerUser);
// Login route
router.post("/login", loginUser);
//validate Routes
router.get('/validatetoken',verifyToken,validateUser)
export default router;
