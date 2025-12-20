import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app: Application = express();

// ========================
// CORS Configuration (FIXED)
// ========================

// List all allowed frontend origins
const allowedOrigins = [
  "https://travel-agent-olive.vercel.app",     // Your current Vercel frontend
  "https://www.lumorabhutan.com",              // Production domain
  "https://lumorabhutan.com",                  // Without www
  "http://localhost:3000",                     // Local development
  // Add preview URLs if needed, e.g.:
  // "https://travel-agent-olive-git-*.vercel.app"
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // Helpful for debugging
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Now safe because we're not using "*"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/v1", router);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running successfully!",
    time: new Date().toISOString(),
  });
});

// ========================
// IMPORTANT FOR VERCEL
// ========================
// Remove app.listen() completely — Vercel doesn't use it in serverless functions
// Instead, export the app directly

// app.listen(...) ← DELETE THIS ENTIRE BLOCK

export default app; // ← This is what Vercel needs