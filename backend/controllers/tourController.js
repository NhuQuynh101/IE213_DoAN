import Tour from "../models/tour.js";
import Ticket from "../models/ticket.js";
import City from "../models/city.js";

const addTour = async (req, res) => {
    try {
        const {
            name,
            category,
            location,
            city,
            duration,
            experiences,
            languageSevice,
            contact,
            suitableFor,
            additionalInformation,
            itinerary,
            tickets,
            fromPrice,
        } = req.body;
        if (
            !name ||
            !location ||
            !city ||
            !duration ||
            !itinerary ||
            !tickets ||
            tickets.length === 0
        ) {
            return res
                .status(400)
                .json({ error: "Thiếu thông tin bắt buộc hoặc chưa có vé" });
        }

        const ticketIds = [];
        for (const ticketData of tickets) {
            const ticket = new Ticket(ticketData);
            await ticket.save();
            ticketIds.push(ticket._id);
        }

        const tour = Tour({
            name,
            category,
            location,
            city,
            duration,
            experiences,
            languageSevice,
            contact,
            suitableFor,
            additionalInformation,
            itinerary,
            tickets: ticketIds,
            fromPrice,
        });

        await tour.save();
        res.status(201).json(tour);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};

const addTicketToTour = async (req, res) => {
    try {
        const { title, prices } = req.body;
        if (!title || !prices) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }

        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ error: "Tour không tồn tại" });
        }

        const ticket = new Ticket(req.body);
        await ticket.save();
        tour.tickets.push(ticket._id);
        await tour.save();

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};

const deleteTicketFromTour = async (req, res) => {
    try {
        const { tourId, ticketId } = req.params;
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ error: "Tour không tồn tại" });
        }

        const ticketIndex = tour.tickets.indexOf(ticketId);
        if (ticketIndex === -1) {
            return res.status(400).json({ error: "Vé không có trong tour" });
        }

        tour.tickets.splice(ticketIndex, 1);

        const ticket = await Ticket.findByIdAndDelete(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Vé không tồn tại" });
        }

        if (tour.tickets.length === 0) {
            await Tour.findByIdAndDelete(tourId);
            return res.status(200).json({
                message: "Xóa vé và xóa tour vì tour không còn vé",
            });
        }

        res.status(200).json(tour);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};

const updateTicketInTour = async (req, res) => {
    try {
        const { tourId, ticketId } = req.params;

        const tour = Tour.findById(tourId);
        if (!tour) {
            return res.status(400).json({ error: "Tour không tồn tại" });
        }

        const ticketIndex = tour.tickets.indexOf(ticketId);
        if (ticketIndex === -1) {
            return res.status(400).json({ error: "Vé không có trong tour" });
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            req.body,
            {
                new: true,
            }
        );
        if (!updatedTicket) {
            return res.status(404).json({ message: "Vé không tồn tại" });
        }

        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};

const deleteTour = async (req, res) => {
    try {
        const { tourId } = req.params;

        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour không tồn tại" });
        }

        await Ticket.deleteMany({ _id: { $in: tour.tickets } });
        await Tour.findByIdAndDelete(tourId);
        res.status(200).json({ message: "Đã xóa tour và các vé liên quan" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server", details: error.message });
    }
};

const updateTour = async (req, res) => {
    const { tourId } = req.params;
    const { name, location, city, duration, itinerary } = req.body;
    if (!name || !location || !city || !duration || !itinerary) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
        new: true,
    });

    if (!updatedTour) {
        return res.status(404).json({ message: "Tour không tồn tại" });
    }

    res.status(200).json(updatedTicket);
};

const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        const tours = await Tour.aggregate([
            {
                $search: {
                    index: "search_tour",
                    text: {
                        query: q,
                        path: ["name", "category", "location", "experiences"],
                    },
                    fuzzy: {},
                },
            },
            {
                $limit: 3,
            },
            {
                $lookup: {
                    from: "tickets",
                    localField: "tickets",
                    foreignField: "_id",
                    as: "ticketDetails",
                    pipeline: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 3 },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                price: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    name: 1,
                    location: 1,
                    images: 1,
                    ticketDetails: 1,
                },
            },
        ]);

        const cities = City.aggregate([
            {
                $search: {
                    index: "search_city",
                    text: {
                        query: q,
                        path: ["name"],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                },
            },
        ]);

        res.status(200).json({ tours, cities });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const getSearchResults = async (req, res) => {
    try {
        const q = req.query.q;
        const tours = await Tour.aggregate([
            {
                $search: {
                    index: "search_tour",
                    text: {
                        query: q,
                        path: ["name", "category", "location", "experiences"],
                    },
                    fuzzy: {},
                },
            },
            {
                $project: {
                    name: 1,
                    location: 1,
                    images: 1,
                    category: 1,
                    languageService: 1,
                    fromPrice: 1,
                },
            },
        ]);

        res.status(200).json({
            tours,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};
