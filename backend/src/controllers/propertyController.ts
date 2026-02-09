import { Request, Response } from "express";
import Property from "../models/Property.js";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
} from "../validators/property.js";
import { AuthRequest } from "../middleware/auth.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.js";
import { deletePattern } from "../utils/redis.js";

// Helper to parse multipart fields
const parseFields = (body: Record<string, any>) => {
  const fields = [
    "address",
    "pricing",
    "details",
    "amenities",
    "media",
    "availability",
  ];
  fields.forEach((field) => {
    if (typeof body[field] === "string") {
      try {
        body[field] = JSON.parse(body[field]);
      } catch (e) {
        // Leave as is if not valid JSON
      }
    }
  });
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, bathrooms, type } = req.query;

    const query: Record<string, any> = {};

    if (city) query["address.city"] = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      query["pricing.monthlyRent"] = {};
      if (minPrice) query["pricing.monthlyRent"].$gte = Number(minPrice);
      if (maxPrice) query["pricing.monthlyRent"].$lte = Number(maxPrice);
    }
    if (bedrooms) query["details.bedrooms"] = Number(bedrooms);
    if (bathrooms) query["details.bathrooms"] = Number(bathrooms);
    if (type) query.type = type;

    query["availability.status"] = "available";

    const properties = await Property.find(query).populate(
      "landlord",
      "profile email",
    );
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "landlord",
      "profile email",
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    parseFields(req.body);

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const photos = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
      );
      if (!req.body.media) req.body.media = {};
      req.body.media.photos = photos;
    }

    const validation = propertyCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const property = await Property.create({
      ...validation.data,
      landlord: req.user!._id,
    });

    // Invalidate caches
    await deletePattern("cache:/api/properties*");

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    parseFields(req.body);

    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user!._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    // Handle photos:
    // 1. Keep existing photos that were passed in media.photos
    // 2. Add any new uploaded photos
    const existingPhotosToKeep = req.body.media?.photos || [];
    let finalPhotos = [...existingPhotosToKeep];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newPhotos = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
      );
      finalPhotos = [...finalPhotos, ...newPhotos];
    }

    if (!req.body.media) req.body.media = {};
    req.body.media.photos = finalPhotos;

    const validation = propertyUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      validation.data,
      { new: true },
    );

    // Invalidate caches
    await deletePattern("cache:/api/properties*");

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user!._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();

    // Invalidate caches
    await deletePattern("cache:/api/properties*");

    res.json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getLandlordProperties = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const properties = await Property.find({ landlord: req.params.userId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
