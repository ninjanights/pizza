import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./config/database.js";

import menuRoutes from "./routes/menu.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
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



export default app;
