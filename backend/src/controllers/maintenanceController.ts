import { Request, Response } from "express";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import Property from "../models/Property.js";
import {
  maintenanceRequestCreateSchema,
  maintenanceStatusUpdateSchema,
} from "../validators/maintenance.js";
import { AuthRequest } from "../middleware/auth.js";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.js";
import { MaintenanceStatus } from "../types/index.js";

// @desc    Submit maintenance request
// @route   POST /api/maintenance
// @access  Private/Tenant
export const createMaintenanceRequest = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const validation = maintenanceRequestCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    let photos: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      photos = await uploadMultipleToCloudinary(
        req.files as Express.Multer.File[],
      );
    }

    const maintenanceRequest = await MaintenanceRequest.create({
      ...validation.data,
      tenant: req.user._id,
      landlord: property.landlord,
      photos,
      status: MaintenanceStatus.SUBMITTED,
      timeline: [
        {
          status: MaintenanceStatus.SUBMITTED,
          note: "Request submitted by tenant",
          updatedBy: req.user._id,
        },
      ],
    });

    res.status(201).json(maintenanceRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get property maintenance requests
// @route   GET /api/maintenance/property/:propertyId
// @access  Private/Landlord
export const getPropertyMaintenanceRequests = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const requests = await MaintenanceRequest.find({
      property: req.params.propertyId,
    })
      .populate("tenant", "profile email")
      .sort("-createdAt");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get tenant's maintenance requests
// @route   GET /api/maintenance/tenant/:userId
// @access  Private/Tenant
export const getTenantMaintenanceRequests = async (
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

    const requests = await MaintenanceRequest.find({
      tenant: req.params.userId,
    })
      .populate("property", "title address pricing")
      .sort("-createdAt");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update maintenance request status
// @route   PUT /api/maintenance/:id/status
// @access  Private/Landlord
export const updateMaintenanceStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const validation = maintenanceStatusUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const maintenanceRequest = await MaintenanceRequest.findById(req.params.id);
    if (!maintenanceRequest) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    if (maintenanceRequest.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    maintenanceRequest.status = validation.data.status;
    if (validation.data.priority)
      maintenanceRequest.priority = validation.data.priority;
    if (validation.data.landlordResponse)
      maintenanceRequest.landlordResponse = validation.data.landlordResponse;
    if (validation.data.resolutionNotes)
      maintenanceRequest.resolutionNotes = validation.data.resolutionNotes;

    maintenanceRequest.timeline.push({
      status: validation.data.status,
      note:
        validation.data.landlordResponse ||
        `Status updated to ${validation.data.status}`,
      updatedBy: req.user._id,
      timestamp: new Date(),
    });

    if (validation.data.status === MaintenanceStatus.COMPLETED) {
      maintenanceRequest.completedAt = new Date();
    }

    await maintenanceRequest.save();

    res.json(maintenanceRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
