import { Request, Response } from "express";
import Review from "../models/Review.js";
import Property from "../models/Property.js";
import {
  reviewCreateSchema,
  reviewResponseSchema,
} from "../validators/review.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const validation = reviewCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { property, reviewee } = validation.data;

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if reviewer is not reviewing themselves
    if (req.user._id.toString() === reviewee) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    const review = await Review.create({
      ...validation.data,
      reviewer: req.user._id,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
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

// @desc    Get reviews for a user (as a reviewee)
// @route   GET /api/reviews/user/:userId
// @access  Public
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

// @desc    Respond to a review
// @route   PUT /api/reviews/:id/response
// @access  Private
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
