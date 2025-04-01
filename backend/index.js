import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import facilityRoute from "./routes/facilityRoute.js";
import cityRoute from "./routes/cityRoute.js";
import tourRoute from "./routes/tourRoute.js";

import hotelRoute from "./routes/hotelRoute.js";

//Utilities
import connectDB from "./config/db.js";
dotenv.config();
const port = process.env.PORT || 3000;

//Database
connectDB();

//App
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/facility", facilityRoute);
app.use("/api/city", cityRoute);

app.use("api/tour", tourRoute);

app.use("/api/hotel", hotelRoute);
app.listen(port, () =>
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`)
);
