import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes"; // adjust path if needed

dotenv.config();

const app: Application = express();

// ✅ Dynamic CORS configuration for hotspot/local network testing
const corsOptions: CorsOptions = {
  origin:"*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

// ✅ Use 0.0.0.0 so it’s accessible from other laptops via hotspot IP
const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
