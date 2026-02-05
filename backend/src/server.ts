import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/properties.js";
import applicationRoutes from "./routes/applications.js";
import leaseRoutes from "./routes/leases.js";
import maintenanceRoutes from "./routes/maintenance.js";

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
app.use("/api/applications", applicationRoutes);
app.use("/api/leases", leaseRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Error Handler
// app.use((err: any, req: any, res: any, next: any) => {
//   console.error(err);
//   if (err.name === "MulterError") {
//     return res
//       .status(400)
//       .json({ message: `Multer Error: ${err.message}`, field: err.field });
//   }
//   res.status(500).json({ message: err.message || "Server Error" });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
