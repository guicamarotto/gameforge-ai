import dotenv from "dotenv";

// âœ… CARREGAR .env ANTES de tudo
dotenv.config();

import express from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api", gameRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  logger.info(`íº€ Backend running at http://localhost:${PORT}`);
  logger.info(`í³¡ CORS enabled for: ${FRONTEND_URL}`);
});
