import express from "express";
import {
    listCity,
    addCity,
    addPopularPlace,
    removeCity,
    removePopularPlace
} from "../controllers/cityController.js";

const router = express.Router();

router.get("/listCity", listCity);
router.post("/addCity", addCity);
router.post("/:cityId/add-popular-place", addPopularPlace);
router.delete("/removeCity/:cityId", removeCity);
router.delete("/removePopularPlace/:cityId/:placeId", removePopularPlace);

export default router;