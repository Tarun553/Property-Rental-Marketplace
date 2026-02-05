import { Request, Response } from "express";
import Review from "../models/Review.js";
import Property from "../models/Property.js";
import Lease from "../models/Lease.js";
import {
  reviewCreateSchema,
  reviewResponseSchema,
} from "../validators/review.js";
import { AuthRequest } from "../middleware/auth.js";
import { UserRole, LeaseStatus } from "../types/index.js";

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const validation = reviewCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const {
      property,
      reviewee,
      lease: leaseId,
      reviewerRole,
    } = validation.data;

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if reviewer is not reviewing themselves
    if (req.user._id.toString() === reviewee) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    // For tenants reviewing landlords/properties, verify they have an active or completed lease
    if (reviewerRole === UserRole.TENANT) {
      const validLease = await Lease.findOne({
        property: property,
        tenant: req.user._id,
        status: { $in: [LeaseStatus.ACTIVE, LeaseStatus.EXPIRED] },
      });

      if (!validLease) {
        return res.status(403).json({
          message:
            "You can only review properties you have rented with an active or completed lease",
        });
      }

      // Verify the reviewee is the landlord of the property
      if (propertyExists.landlord.toString() !== reviewee) {
        return res
          .status(400)
          .json({ message: "Invalid reviewee for this property" });
      }
    }

    // For landlords reviewing tenants, verify they had a lease with the tenant
    if (reviewerRole === UserRole.LANDLORD) {
      const validLease = await Lease.findOne({
        property: property,
        landlord: req.user._id,
        tenant: reviewee,
        status: { $in: [LeaseStatus.ACTIVE, LeaseStatus.EXPIRED] },
      });

      if (!validLease) {
        return res.status(403).json({
          message:
            "You can only review tenants who have had an active or completed lease on your property",
        });
      }
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      property: property,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this property" });
    }

    const review = await Review.create({
      ...validation.data,
      reviewer: req.user._id,
    });

    // Populate the review before returning
    await review.populate([
      { path: "reviewer", select: "profile email" },
      { path: "property", select: "title address" },
    ]);

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPropertyReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate("reviewer", "profile email")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "profile email")
      .populate("property", "title address")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get reviews written by a specific user
export const getReviewsByReviewer = async (req: AuthRequest, res: Response) => {
  try {
    // Only allow users to see their own written reviews
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const reviews = await Review.find({ reviewer: req.params.userId })
      .populate("reviewee", "profile email")
      .populate("property", "title address")
      .sort("-createdAt");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const respondToReview = async (req: AuthRequest, res: Response) => {
  try {
    const validation = reviewResponseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the current user is the reviewee
    if (review.reviewee.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to respond to this review" });
    }

    review.response = validation.data.response;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
