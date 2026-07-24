import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import api from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/error.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.PORTAL_URL,
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  "http://localhost:8080",
  "http://localhost:8081",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      console.warn(`CORS blocked origin: ${origin}`);
      return cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "SyncReach API",
    version: "1.0.0",
    health: "/api/health",
  });
});

app.use("/api", api);
app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Set it in backend/.env or Render env.");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing.");
  }

  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, HOST, () => {
    console.log(`SyncReach API listening on http://${HOST}:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
