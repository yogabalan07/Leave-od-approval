import express from "express";
import cors from "cors";
import path from "path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import odRoutes from "./routes/od.routes";
import leaveRoutes from "./routes/leave.routes";
import mentorRoutes from "./routes/mentor.routes";
import hodRoutes from "./routes/hod.routes";
import evidenceRoutes from "./routes/evidence.routes";
import verificationRoutes from "./routes/verification.routes";
import adminRoutes from "./routes/admin.routes";
import notificationRoutes from "./routes/notification.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => res.json({ success: true, message: "Smart OD System API 🚀" }));
app.get("/api/health", (_req, res) => res.json({ success: true, timestamp: new Date() }));

app.use("/api/auth", authRoutes);
app.use("/api/od", odRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(errorHandler);

export default app;
