import express from "express";
import cloudinary from "../utils/cloudinary.js"
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const files = req.body.data;
        if (!Array.isArray(files)) {
            return res.status(400).json({ error: 'Data must be an array of images' });
        }
        // console.log(files);
        const uploadResults = [];
        for (const fileStr of files) {
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'ml_default',
                width: 867,
                height: 578,
                crop: 'fill',
                gravity: 'auto',
            });
            uploadResults.push(uploadResponse);
        }
        res.json(uploadResults.map(img => img.public_id));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;