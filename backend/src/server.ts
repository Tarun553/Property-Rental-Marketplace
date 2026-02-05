import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
