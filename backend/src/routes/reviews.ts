import express from "express";
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  getReviewsByReviewer,
  respondToReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/property/:propertyId", getPropertyReviews);
router.get("/user/:userId", getUserReviews);
router.get("/written/:userId", protect, getReviewsByReviewer);
router.put("/:id/response", protect, respondToReview);

export default router;
