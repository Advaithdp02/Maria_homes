import Listing from "../models/Listing.js";

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createListing = async (req, res) => {
  try {
    const { title, location, price, type, area, features, shortDescription, longDescription, bedrooms, bathrooms, floors,carParking, featured } = req.body;

    const imageUrls = req.files.map(file => file.path); // Cloudinary URLs

    const newListing = new Listing({
      title,
      location,
      price,
      type,
      area,
      features: JSON.parse(features), // Important if sent as string
      shortDescription,
      longDescription,
      bedrooms,
      bathrooms,
      floors,
      carParking,
      featured,
      images: imageUrls,
    });

    await newListing.save();
    res.status(201).json(newListing);

  } catch (error) {
    console.error("Error creating listing:", error); // ✅ log this
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const getFilteredListings = async (req, res) => {
  try {
    const { type, bedrooms, bathrooms,carParking, floors, maxPrice, maxArea } = req.query;

    const query = {};
    if (type) query.type = type;
    if (bedrooms) query.bedrooms = bedrooms;
    if (bathrooms) query.bathrooms = bathrooms;
    if (floors) query.floors = floors;
    if (carParking) query.carParking = carParking;
    if (maxPrice) query.price = { $lte: maxPrice };
    if (maxArea) query.area = { $lte: maxArea };

    const listings = await Listing.find(query);
    res.json(listings);
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: "Failed to fetch filtered listings" });
  }
};