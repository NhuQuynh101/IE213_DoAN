console.log("Hello ");

//packages

import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

//Utilities
import connectDB from "./config/db.js";

dotenv.config();
const port = process.env.PORT || 5000;

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

//Routes
app.listen(port, () => console.log(`Server running on port ${port}`));


