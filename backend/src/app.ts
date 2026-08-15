import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/database.js";

import menuRoutes from "./routes/menu.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminAuthRoutes from "./routes/admin.auth.routes.js";
import adminOrderRoutes from "./routes/admin.order.routes.js";
import adminSessionRoutes from "./routes/admin.session.routes.js";
import adminSettingsRoutes from "./routes/admin.settings.routes.js";

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});
app.use("/api/menu", menuRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/sessions", adminSessionRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
export default app;
