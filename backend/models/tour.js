import mongoose from "mongoose";

const tourSchmema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: [String],
        location: { type: String, required: true },
        city: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true,
        },
        avgRating: Number,
        bookings: Number,
        duration: {
            type: String,
            required: true,
        },
        durationInHours: { type: Number, required: true },
        experiences: {
            type: String,
            required: true,
        },
        images: [String],
        languageService: [String],
        contact: String,
        suitableFor: String,
        additionalInformation: String,
        itinerary: {
            type: String,
            required: true,
        },
        fromPrice: Number,
        tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
    },
    { timestamps: true }
);

const converDurationToHours = (duration) => {
    let hours = 0;
    const dayMatch = duration.match(/(\d+)\s*ngày/);
    const hourMatch = duration.mathc(/(\d+)\s*giờ/);
    const minuteMatch = duration.mathc(/(\d+)\s*phút/);

    if (dayMatch) hours += parseInt(dayMatch[1]) * 24;
    if (hourMatch) hours += parseInt(hourMatch[1]);
    if (minuteMatch) hours += parseInt(minuteMatch[1]) / 60;

    return hours;
};

tourSchmema.pre("save", function (next) {
    this.durationInHours = converDurationToHours(this.duration);
    next();
});
const Tour = mongoose.model("Tour", tourSchmema);
export default Tour;
