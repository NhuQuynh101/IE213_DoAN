import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import initializeAdmin from './config/initAdmin.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import userRoutes from './routes/userRoutes.js';

// Cấu hình dotenv ngay từ đầu để đảm bảo biến môi trường được load
dotenv.config({ path: process.cwd() + '/.env' });

import path from "path";
import facilityRoute from "./routes/facilityRoute.js"
import cityRoute from "./routes/cityRoute.js"
import tourRoute from "./routes/tourRoute.js";
import updateRoute from "./routes/uploadRoute.js"
import hotelRoute from "./routes/hotelRoute.js";
import adminAuthRoute from "./routes/adminAuthRoute.js";

//Utilities
dotenv.config();
const port = process.env.PORT || 3000;

//Database
connectDB();

// Initialize admin account
initializeAdmin();

//App
const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get("/", (req, res) => {
    res.send("API is running...");
});
// API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminAuthRoute);
app.use("/api/facility", facilityRoute);
app.use("/api/city", cityRoute);
app.use("api/tour", tourRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/upload", updateRoute);

app.listen(port, () =>
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`)
);
