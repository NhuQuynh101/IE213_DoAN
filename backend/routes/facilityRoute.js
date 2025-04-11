import express from "express";
import {listFacility, groupFacilityByCategory, listFacilityByCategory, addFacility, removeFacility, addMultipleFacilities} from "../controllers/hotelFacilityController.js"

const router = express.Router();

router.get("/", listFacility);
router.get("/groupByCategory", groupFacilityByCategory);
router.get("/category/:categoryId", listFacilityByCategory);
router.post("/addFacility", addFacility);
router.post("/add-multiple", addMultipleFacilities);
router.delete("/remove/:facilityId", removeFacility);

export default router;