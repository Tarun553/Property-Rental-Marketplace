import express from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
} from "../controllers/propertyController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { UserRole } from "../types/index.js";

const router = express.Router();

import { cacheMiddleware } from "../middleware/cache.js";

router
  .route("/")
  .get(cacheMiddleware(3600), getProperties)
  .post(protect, authorize(UserRole.LANDLORD), upload.any(), createProperty);

router
  .route("/:id")
  .get(cacheMiddleware(3600), getPropertyById)
  .put(protect, authorize(UserRole.LANDLORD), upload.any(), updateProperty)
  .delete(protect, authorize(UserRole.LANDLORD), deleteProperty);

router.get(
  "/landlord/:userId",
  protect,
  authorize(UserRole.LANDLORD),
  getLandlordProperties,
);

export default router;
