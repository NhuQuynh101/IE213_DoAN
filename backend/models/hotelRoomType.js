import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema(
    {
        bedType: { type: String, required: true },
        serveBreakfast: { type: Boolean, default: false },
        maxOfGuest: { type: Number, required: true },
        cancellationPolicy: {
            refund: { type: String, required: true },
            day: { type: Number, required: true },
            percentBeforeDay: { type: Number, required: true },
            percentAfterDay: { type: Number, required: true },
        },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);


const hotelRoomTypeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        img: [
            { type: String, default: [] }
        ],
        area: { type: String },
        view: { type: String },
        roomFacilities: [
            { type: String, default: [] }
        ],
        rooms: [hotelRoomSchema],
        availableRooms: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const HotelRoomType = mongoose.model("HotelRoomType", hotelRoomTypeSchema);
export default HotelRoomType;