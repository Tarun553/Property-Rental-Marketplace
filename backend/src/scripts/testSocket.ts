import { io, Socket } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.argv[2] || process.env.TEST_TOKEN;
const RECIPIENT_ID = process.argv[3] || "65b2a1234567890abcdef123"; // Dummy/Placeholder
const CONVERSATION_ID = "test_conversation_1";

if (!TOKEN) {
  console.error(
    "❌ Error: Please provide a JWT token as the first argument or set TEST_TOKEN in .env",
  );
  process.exit(1);
}

console.log("🚀 Starting Socket.io Test...");

const socket: Socket = io("http://localhost:5000", {
  auth: {
    token: TOKEN,
  },
});

socket.on("connect", () => {
  console.log("✅ Connected to server! Socket ID:", socket.id);

  // 1. Join a conversation
  console.log(`📡 Joining conversation: ${CONVERSATION_ID}`);
  socket.emit("join_conversation", CONVERSATION_ID);

  // 2. Send a test message after a short delay
  setTimeout(() => {
    console.log("✉️ Sending message...");
    socket.emit("send_message", {
      conversationId: CONVERSATION_ID,
      content: "Hello! This is a real-time test message.",
      recipientId: RECIPIENT_ID,
    });
  }, 1000);
});

socket.on("receive_message", (data) => {
  console.log("📥 New message received in real-time:");
  console.log(JSON.stringify(data, null, 2));

  // Exit after receiving message to conclude test
  console.log("🎉 Test successful!");
  socket.disconnect();
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err.message);
  process.exit(1);
});

socket.on("error", (err) => {
  console.error("⚠️ Socket Error:", err);
});

// Timeout if nothing happens
setTimeout(() => {
  console.error("⏳ Test timed out after 10 seconds.");
  socket.disconnect();
  process.exit(1);
}, 10000);
