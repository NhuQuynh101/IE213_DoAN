import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        img: [{ type: String, default: [] }],
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true
        },
        rooms: { type: Number, required: true },
        averageRating: { type: Number, default: 0 },
        description: { type: String, required: true },
        serviceFacilities: [
            {
                categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "HotelCategory" },
                items: [
                    { type: mongoose.Schema.Types.ObjectId, ref: "HotelFacility" }
                ],
            }
        ],
        timeCheckInOut: {
            timeCheckin: { type: String, required: true },
            timeCheckout: { type: String, required: true },
        },
        childrenPolicy: { type: String, required: true },
        checkinPolicy: { type: String, required: true },
        othersPolicies: [
            {
                name: { type: String, required: true },
                content: { type: String, required: true },
            },
        ],
        price: { type: Number, required: true },
        roomTypes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "HotelRoomType"
            }
        ],
    },
    { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
