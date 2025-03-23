import mongoose from "mongoose";

const popularPlace = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        img: [
            {
                type: String,
                default: []
            }
        ]
    }
);

const citySchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        best_time_to_visit: {type: String, required: true},
        popular_place: [popularPlace],
        img: [
            {
                type: String,
                default: []
            }
        ]
    },
    { timestamps: true }
);

const City = mongoose.model("City", citySchema);
export default City;