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
    if (req.query.featured === "true") query.featured = true;

    const listings = await Listing.find(query);
    res.json(listings);
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ error: "Failed to fetch filtered listings" });
  }
};


export const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });

    listing.images = listing.images.filter((img) => img !== imageUrl);
    await listing.save();

    // OPTIONAL: Delete from Cloudinary
    // const publicId = imageUrl.split('/').pop().split('.')[0]; // extract publicId if stored like that
    // await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: "Image deleted", updatedImages: listing.images });
  } catch (err) {
    console.error("Image deletion error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
export const updateListing = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      type,
      area,
      features,
      shortDescription,
      longDescription,
      bedrooms,
      bathrooms,
      floors,
      carParking,
      featured,
    } = req.body;

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Upload new images (if any)
    const newImageUrls = req.files?.map((file) => file.path) || [];

    // Update fields
    listing.title = title;
    listing.location = location;
    listing.price = price;
    listing.type = type;
    listing.area = area;
    listing.features = JSON.parse(features);
    listing.shortDescription = shortDescription;
    listing.longDescription = longDescription;
    listing.bedrooms = bedrooms;
    listing.bathrooms = bathrooms;
    listing.floors = floors;
    listing.carParking = carParking;
    listing.featured = featured === "true" || featured === true;

    // Append new images to existing ones
    listing.images = [...listing.images, ...newImageUrls];

    await listing.save();

    res.status(200).json(listing);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ error: "Failed to update listing" });
  }
}