import Listing from "../models/Listing.js";

export const getAllListings = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;   // Default page 1
    limit = parseInt(limit) || 10; // Default 10 items per page

    const skip = (page - 1) * limit;

    const totalItems = await Listing.countDocuments();
    const listings = await Listing.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      items: listings
    });
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
    let {
      type,
      bedrooms,
      bathrooms,
      carParking,
      floors,
      maxPrice,
      maxArea,
      page,
      limit
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (type) query.type = type;

    const parseOrNull = (val) => {
      if (!val) return null;
      if (val === "5+") return { $gte: 5 };
      const n = Number(val);
      return isNaN(n) ? null : n;
    };

    const bedroomsFilter = parseOrNull(bedrooms);
    if (bedroomsFilter !== null) {
      if (typeof bedroomsFilter === "object") query.bedrooms = bedroomsFilter;
      else query.bedrooms = bedroomsFilter;
    }

    const bathroomsFilter = parseOrNull(bathrooms);
    if (bathroomsFilter !== null) {
      if (typeof bathroomsFilter === "object") query.bathrooms = bathroomsFilter;
      else query.bathrooms = bathroomsFilter;
    }

    const floorsFilter = parseOrNull(floors);
    if (floorsFilter !== null) {
      if (typeof floorsFilter === "object") query.floors = floorsFilter;
      else query.floors = floorsFilter;
    }

    const carParkingFilter = parseOrNull(carParking);
    if (carParkingFilter !== null) {
      if (typeof carParkingFilter === "object") query.carParking = carParkingFilter;
      else query.carParking = carParkingFilter;
    }

    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (maxArea) query.area = { $lte: Number(maxArea) };

    if (req.query.featured === "true") query.featured = true;


    const totalItems = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      items: listings,
    });
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ 
      error: "Failed to fetch filtered listings", 
      // optional, can be removed in production
    });
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

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // Delete images from Cloudinary (optional)
    if (listing.images && listing.images.length > 0) {
      for (const url of listing.images) {
        try {
          const publicId = url.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`Failed to delete image ${url}:`, err.message);
        }
      }
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully." });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};
// ✅ Get Featured Listings Only
export const getFeaturedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ featured: true });
    res.json(listings);
  } catch (err) {
    console.error("Featured fetch error:", err);
    res.status(500).json({ error: "Failed to fetch featured listings" });
  }
};
export const getFilterRanges = async (req, res) => {
  try {
    const listings = await Listing.find();

    const prices = listings.map(l => l.price).filter(p => p != null);
    const areas = listings.map(l => l.area).filter(a => a != null);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minArea = Math.min(...areas);
    const maxArea = Math.max(...areas);

    res.json({
      price: { min: minPrice, max: maxPrice },
      area: { min: minArea, max: maxArea },
    });
  } catch (err) {
    console.error("Error getting filter ranges:", err);
    res.status(500).json({ error: "Failed to get filter values" });
  }
};
