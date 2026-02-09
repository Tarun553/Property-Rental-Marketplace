import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectRedis } from "./utils/redis.js";
import { globalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import applicationRoutes from "./routes/applications.js";
import leaseRoutes from "./routes/leases.js";
import maintenanceRoutes from "./routes/maintenance.js";
import reviewRoutes from "./routes/reviews.js";
import messageRoutes from "./routes/messages.js";
import { socketHandler } from "./socket/socketHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

connectDB();
connectRedis();

const app = express();
const httpServer = createServer(app);

// Clean frontend URL and define CORS
const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
const allowedOrigins = [
  frontendUrl,
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ["polling", "websocket"],
});

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
// Apply rate limiter ONLY to /api routes to avoid blocking socket handshakes
app.use("/api", globalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Initialize socket handlers
socketHandler(io);

// Error handling middleware
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
