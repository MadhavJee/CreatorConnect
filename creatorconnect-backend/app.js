import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoute.js";
import assetRoutes from "./src/routes/assetRoute.js"; 

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Backend is running" });
});

app.use("/auth", authRoutes);
app.use("/assets", assetRoutes); 

export default app;