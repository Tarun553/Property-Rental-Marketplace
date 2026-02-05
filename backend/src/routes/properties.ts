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
import { UserRole } from "../types/index.js";

const router = express.Router();

router
  .route("/")
  .get(getProperties)
  .post(protect, authorize(UserRole.LANDLORD), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, authorize(UserRole.LANDLORD), updateProperty)
  .delete(protect, authorize(UserRole.LANDLORD), deleteProperty);

router.get(
  "/landlord/:userId",
  protect,
  authorize(UserRole.LANDLORD),
  getLandlordProperties,
);

export default router;
