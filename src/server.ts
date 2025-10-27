import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config({ debug: false });
const PORT = process.env.PORT || 5000;
app.use('/api/v1', router);
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
