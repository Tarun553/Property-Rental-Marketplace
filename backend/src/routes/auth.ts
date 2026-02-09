import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import { protect, AuthRequest } from "../middleware/auth.js";

import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// Example protected route
router.get("/me", protect, (req: AuthRequest, res) => {
  res.json(req.user);
});

export default router;
