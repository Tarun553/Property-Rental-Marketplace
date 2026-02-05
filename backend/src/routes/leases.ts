import express from "express";
import {
  createLease,
  getLeaseById,
  signLease,
  getPropertyLeases,
} from "../controllers/leaseController.js";
import { protect, authorize } from "../middleware/auth.js";
import { UserRole } from "../types/index.js";

const router = express.Router();

router.post("/", protect, authorize(UserRole.LANDLORD), createLease);

router.get("/:id", protect, getLeaseById);

router.put("/:id/sign", protect, signLease);

router.get(
  "/property/:propertyId",
  protect,
  authorize(UserRole.LANDLORD),
  getPropertyLeases,
);

export default router;
