import path from "path";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import facilityRoute from "./routes/facilityRoute.js";
import cityRoute from "./routes/cityRoute.js";
import tourRoute from "./routes/tourRoute.js";
import updateRoute from "./routes/uploadRoute.js"
import hotelRoute from "./routes/hotelRoute.js";

//Utilities
import connectDB from "./config/db.js";
dotenv.config();
const port = process.env.PORT || 3000;

//Database
connectDB();

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

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/facility", facilityRoute);
app.use("/api/city", cityRoute);
app.use("api/tour", tourRoute);
app.use("/api/hotel", hotelRoute);
app.use("/api/upload", updateRoute);

app.listen(port, () =>
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`)
);
