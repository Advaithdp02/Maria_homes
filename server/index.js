import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import listingRoutes from "./routes/listingRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/listings", listingRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Maria Homes API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
