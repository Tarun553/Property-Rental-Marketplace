import { Response } from "express";
import MessageThread from "../models/Message.js";
import { AuthRequest } from "../middleware/auth.js";
import User from "../models/User.js";
import { messageStartSchema } from "../validators/message.js";

// Create or get existing conversation between two users
export const startConversation = async (req: AuthRequest, res: Response) => {
  try {
    const validation = messageStartSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { recipientId, propertyId, message } = validation.data;
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const senderId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    if (senderId.toString() === recipientId) {
      return res
        .status(400)
        .json({ message: "Cannot start conversation with yourself" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Generate a consistent conversationId (sorted user IDs)
    const sortedIds = [senderId.toString(), recipientId].sort();
    const conversationId = propertyId
      ? `${sortedIds[0]}_${sortedIds[1]}_${propertyId}`
      : `${sortedIds[0]}_${sortedIds[1]}`;

    // Check if conversation already exists
    let thread = await MessageThread.findOne({ conversationId });

    if (!thread) {
      // Create new thread
      thread = await MessageThread.create({
        conversationId,
        participants: [senderId, recipientId],
        relatedProperty: propertyId || undefined,
        messages: message
          ? [
              {
                sender: senderId,
                content: message,
                timestamp: new Date(),
                read: false,
              },
            ]
          : [],
        lastMessageAt: new Date(),
      });
    } else if (message) {
      // Add initial message to existing thread
      thread.messages.push({
        sender: senderId,
        content: message,
        timestamp: new Date(),
        read: false,
      });
      thread.lastMessageAt = new Date();
      await thread.save();
    }

    // Populate and return
    await thread.populate([
      { path: "participants", select: "profile email" },
      { path: "relatedProperty", select: "title address" },
    ]);

    res.status(201).json(thread);
  } catch (error) {
    console.error("Start conversation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserThreads = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
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

export const getConversationHistory = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
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

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const thread = await MessageThread.findOne({
      conversationId: req.params.conversationId,
      participants: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const currentUserId = req.user._id.toString();
    // Mark all messages as read that were sent by others
    thread.messages.forEach((msg) => {
      if (msg.sender.toString() !== currentUserId) {
        msg.read = true;
      }
    });

    await thread.save();
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
