import { Request, Response } from "express";
import Property from "../models/Property.js";
import {
  propertyCreateSchema,
  propertyUpdateSchema,
} from "../validators/property.js";
import { AuthRequest } from "../middleware/auth.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.js";

// Helper to parse multipart fields
const parseFields = (body: any) => {
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

// @desc    List properties with filters
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req: Request, res: Response) => {
  try {
    const { city, minPrice, maxPrice, bedrooms, bathrooms, type } = req.query;

    const query: any = {};

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

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
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

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Landlord
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
      landlord: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Landlord
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    parseFields(req.body);

    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const photos = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
      );
      if (!req.body.media) req.body.media = {};

      // Merge with existing photos if needed, or replace.
      // For now, let's assume replacement if media.photos is provided in body, or merge.
      // Simplest: Replace if photos are uploaded.
      req.body.media.photos = photos;
    }

    const validation = propertyUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      validation.data,
      { new: true },
    );

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Landlord
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();

    res.json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get landlord's properties
// @route   GET /api/properties/landlord/:userId
// @access  Private/Landlord
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
