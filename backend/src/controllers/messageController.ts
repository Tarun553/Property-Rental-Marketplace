import { Response } from "express";
import MessageThread from "../models/Message.js";
import { AuthRequest } from "../middleware/auth.js";

// @desc    Get all conversation threads for the current user
// @route   GET /api/messages/threads
// @access  Private
export const getUserThreads = async (req: AuthRequest, res: Response) => {
  try {
    const threads = await MessageThread.find({
      participants: req.user._id,
    })
      .populate("participants", "profile email")
      .populate("relatedProperty", "title address")
      .sort("-lastMessageAt");

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get specific conversation history
// @route   GET /api/messages/:conversationId
// @access  Private
export const getConversationHistory = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const thread = await MessageThread.findOne({
      conversationId: req.params.conversationId,
      participants: req.user._id,
    })
      .populate("participants", "profile email")
      .populate("messages.sender", "profile email");

    if (!thread) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const thread = await MessageThread.findOne({
      conversationId: req.params.conversationId,
      participants: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Mark all messages as read that were sent by others
    thread.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user._id.toString()) {
        msg.read = true;
      }
    });

    await thread.save();
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
