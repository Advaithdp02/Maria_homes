import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinaryConfig.js";
import {
  getAllListings,
  getListingById,
  createListing,
  getFilteredListings,
  deleteImage,
  updateListing,
  deleteListing,
  getFeaturedListings,
} from "../controllers/listingController.js";

const router = express.Router();
const upload = multer({ storage });

router.get("/", getAllListings);
router.get("/featured", getFeaturedListings);
router.get("/:id", getListingById);
router.post("/", upload.array("images", 15), createListing);
router.get("/filters", getFilteredListings);
router.delete("/:id/image", deleteImage);
router.delete("/:id", deleteListing);
router.put("/:id/delete-image", deleteImage); 
router.put("/:id", upload.array("images", 15), updateListing);

export default router;
