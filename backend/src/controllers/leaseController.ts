import { Request, Response } from "express";
import Lease from "../models/Lease.js";
import Property from "../models/Property.js";
import { leaseCreateSchema, leaseSignSchema } from "../validators/lease.js";
import { AuthRequest } from "../middleware/auth.js";
import { LeaseStatus, UserRole } from "../types/index.js";

export const createLease = async (req: AuthRequest, res: Response) => {
  try {
    const validation = leaseCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to create lease for this property" });
    }

    const lease = await Lease.create({
      ...validation.data,
      landlord: req.user._id,
      status: LeaseStatus.DRAFT,
    });

    res.status(201).json(lease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaseById = async (req: AuthRequest, res: Response) => {
  try {
    const lease = await Lease.findById(req.params.id)
      .populate("property", "title address pricing")
      .populate("landlord", "profile email")
      .populate("tenant", "profile email");

    if (!lease) {
      return res.status(404).json({ message: "Lease not found" });
    }

    const isLandlord =
      lease.landlord._id.toString() === req.user._id.toString();
    const isTenant = lease.tenant._id.toString() === req.user._id.toString();

    if (!isLandlord && !isTenant && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to view this lease" });
    }

    res.json(lease);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signLease = async (req: AuthRequest, res: Response) => {
  try {
    const validation = leaseSignSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const lease = await Lease.findById(req.params.id);
    if (!lease) {
      return res.status(404).json({ message: "Lease not found" });
    }

    const isLandlord = lease.landlord.toString() === req.user._id.toString();
    const isTenant = lease.tenant.toString() === req.user._id.toString();

    if (!isLandlord && !isTenant) {
      return res
        .status(403)
        .json({ message: "Not authorized to sign this lease" });
    }

    if (isLandlord) {
      lease.signatures = lease.signatures || {};
      lease.signatures.landlord = {
        signed: true,
        signatureData: validation.data.signatureData,
        signedAt: new Date(),
      };
    } else {
      lease.signatures = lease.signatures || {};
      lease.signatures.tenant = {
        signed: true,
        signatureData: validation.data.signatureData,
        signedAt: new Date(),
      };
    }

    // Update status if both signed
    if (
      lease.signatures?.landlord?.signed &&
      lease.signatures?.tenant?.signed
    ) {
      lease.status = LeaseStatus.ACTIVE;
    } else {
      lease.status = LeaseStatus.PENDING_SIGNATURES;
    }

    await lease.save();

    res.json(lease);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getPropertyLeases = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const leases = await Lease.find({ property: req.params.propertyId })
      .populate("tenant", "profile email")
      .sort("-createdAt");

    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTenantLeases = async (req: AuthRequest, res: Response) => {
  try {
    // Only allow tenants to view their own leases
    if (req.user._id.toString() !== req.params.tenantId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const leases = await Lease.find({ tenant: req.params.tenantId })
      .populate("property", "title address pricing media")
      .populate("landlord", "profile email")
      .sort("-createdAt");

    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
