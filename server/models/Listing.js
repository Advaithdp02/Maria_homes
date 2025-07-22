import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ["house", "plot"], required: true },
  area: { type: Number, required: true },
  features: [{ type: String }],
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  images: [{ type: String }],  // Cloudinary URLs (images/videos)
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  carParking: { type: Number },
  floors: { type: Number },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
