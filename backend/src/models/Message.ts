import mongoose from "mongoose";

const messageThreadSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    relatedProperty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

messageThreadSchema.index({ participants: 1 });
messageThreadSchema.index({ lastMessageAt: -1 });

const MessageThread = mongoose.model("MessageThread", messageThreadSchema);

export default MessageThread;
