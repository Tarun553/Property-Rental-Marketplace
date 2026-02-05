import { Server, Socket } from "socket.io";
import { verifyAccessToken } from "../utils/auth.js";
import User from "../models/User.js";
import MessageThread from "../models/Message.js";

interface SocketUser {
  id: string;
  role: string;
}

export const socketHandler = (io: Server) => {
  // Authentication middleware for socket
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error: Token missing"));

      const decoded: any = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) return next(new Error("Authentication error: User not found"));

      socket.data.user = { id: user._id.toString(), role: user.role };
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.user.id;
    console.log(`User connected: ${userId} (${socket.id})`);

    // Join a specific conversation room
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation: ${conversationId}`);
    });

    // Handle sending message
    socket.on(
      "send_message",
      async (data: {
        conversationId: string;
        content: string;
        recipientId: string;
        propertyId?: string;
      }) => {
        const { conversationId, content, recipientId, propertyId } = data;

        try {
          let thread = await MessageThread.findOne({ conversationId });

          if (!thread) {
            // Create new thread if doesn't exist
            thread = await MessageThread.create({
              conversationId,
              participants: [userId, recipientId],
              relatedProperty: propertyId,
              messages: [],
            });
          }

          const newMessage = {
            sender: userId,
            content,
            timestamp: new Date(),
            read: false,
          };

          thread.messages.push(newMessage);
          thread.lastMessageAt = new Date();
          await thread.save();

          // Broadcast to the room
          io.to(conversationId).emit("receive_message", {
            conversationId,
            message: newMessage,
          });
        } catch (error) {
          console.error("Socket error - send_message:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      },
    );

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};
