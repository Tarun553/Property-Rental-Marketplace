import express from "express";
import {
  createMaintenanceRequest,
  getPropertyMaintenanceRequests,
  getTenantMaintenanceRequests,
  updateMaintenanceStatus,
} from "../controllers/maintenanceController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import { UserRole } from "../types/index.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize(UserRole.TENANT),
  upload.array("photos"),
  createMaintenanceRequest,
);

router.get(
  "/property/:propertyId",
  protect,
  authorize(UserRole.LANDLORD),
  getPropertyMaintenanceRequests,
);

router.get(
  "/tenant/:userId",
  protect,
  authorize(UserRole.TENANT),
  getTenantMaintenanceRequests,
);

router.put(
  "/:id/status",
  protect,
  authorize(UserRole.LANDLORD),
  updateMaintenanceStatus,
);

export default router;
