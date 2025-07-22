import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinaryConfig.js";
import {
  getAllListings,
  getListingById,
  createListing,
  getFilteredListings,
} from "../controllers/listingController.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", upload.array("images", 10), createListing);
router.get("/filters", getFilteredListings);
export default router;
