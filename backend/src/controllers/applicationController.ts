import { Request, Response } from "express";
import Application from "../models/Application.js";
import Property from "../models/Property.js";
import {
  applicationSubmitSchema,
  applicationStatusUpdateSchema,
} from "../validators/application.js";
import { AuthRequest } from "../middleware/auth.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.js";
import { ApplicationStatus } from "../types/index.js";

// Helper to parse multipart fields
const parseFields = (body: any) => {
  const fields = ["personalInfo", "references"];
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


export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    parseFields(req.body);

    const validation = applicationSubmitSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if tenant already applied
    const existingApplication = await Application.findOne({
      property: req.body.property,
      tenant: req.user._id,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this property" });
    }

    let documents: { type: string; url: string; name: string }[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const urls = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
      );
      documents = urls.map((url, index) => ({
        url,
        type: "other", 
        name: (req.files as Express.Multer.File[])[index].originalname,
      }));
    }

    const application = await Application.create({
      ...validation.data,
      tenant: req.user._id,
      landlord: property.landlord,
      documents,
      status: ApplicationStatus.PENDING,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getPropertyApplications = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to view applications for this property",
      });
    }

    const applications = await Application.find({
      property: req.params.propertyId,
    })
      .populate("tenant", "profile email")
      .sort("-createdAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getTenantApplications = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (
      req.user._id.toString() !== req.params.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ tenant: req.params.userId })
      .populate("property", "title address pricing")
      .sort("-createdAt");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const validation = applicationStatusUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.landlord.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    application.status = validation.data.status;
    if (validation.data.landlordNotes) {
      application.landlordNotes = validation.data.landlordNotes;
    }

    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
