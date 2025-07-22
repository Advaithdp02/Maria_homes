import express from "express";
import { sendContactQuery } from "../controllers/mailController.js";

const router = express.Router();

router.post("/send-query", sendContactQuery);

export default router;
