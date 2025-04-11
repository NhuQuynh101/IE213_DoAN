import express from "express";
import {
    createTour,
    addTicketToTour,
    updateTicketInTour,
    deleteTicketFromTour,
    updateTour,
    deleteTour,
    getSearchSuggestions,
    getSearchResults,
    getTours,
    getTourDetail,
} from "../controllers/tourController.js";

const router = express.Router();
router.route("/").post(createTour);

export default router;
