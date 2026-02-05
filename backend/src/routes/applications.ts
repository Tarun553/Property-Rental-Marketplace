import express from "express";
import {
  submitApplication,
  getPropertyApplications,
  getTenantApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { UserRole } from "../types/index.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(UserRole.TENANT),
  upload.array("documents"),
  submitApplication,
);

router.get(
  "/property/:propertyId",
  protect,
  authorize(UserRole.LANDLORD),
  getPropertyApplications,
);

router.get(
  "/tenant/:userId",
  protect,
  authorize(UserRole.TENANT),
  getTenantApplications,
);

router.put(
  "/:id/status",
  protect,
  authorize(UserRole.LANDLORD),
  updateApplicationStatus,
);

export default router;
