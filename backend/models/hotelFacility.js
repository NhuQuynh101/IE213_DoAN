import mongoose from "mongoose";

const hotelFacilitySchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HotelCategory",
            required: true
        },
        name: {type: String, required: true},
        icon: {type: String, required: true}
    },
    {timestamps: true}
);

const HotelFacility = mongoose.model("HotelFacility", hotelFacilitySchema);
export default HotelFacility;