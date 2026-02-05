import express from "express";
import {
  getUserThreads,
  getConversationHistory,
  markAsRead,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/threads", protect, getUserThreads);
router.get("/:conversationId", protect, getConversationHistory);
router.put("/:conversationId/read", protect, markAsRead);

export default router;
