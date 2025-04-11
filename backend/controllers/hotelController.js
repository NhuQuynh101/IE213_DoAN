import Hotel from "../models/hotel.js";
import HotelRoomType from "../models/hotelRoomType.js";
import HotelCategory from "../models/hotelCategory.js"
import HotelFacility from "../models/hotelFacility.js";
import City from "../models/city.js"
import mongoose from "mongoose";

const listHotel = async (req, res) => {
    try{
        const hotels = await Hotel.find({}).populate({
            path: "city",
            select: "name",
        }).populate({
            path: "roomTypes",
        }).populate({
            path: "serviceFacilities.categoryId",
            select: "name",
        }).populate({
            path: "serviceFacilities.items",
            select: "name",
        });
        res.status(200).json(hotels);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const listRoomTypeByHotel = async (req, res) => {
    try{
        const { hotelId } = req.params;
        if (!hotelId)
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        const hotel = await Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ error: "Khách sạn không tồn tại" });

        const roomTypes = await HotelRoomType.find({ _id: { $in: hotel.roomTypes } });
        res.status(200).json(roomTypes);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const listRoomByRoomType = async (req, res) => {
    try{
        const { roomTypeId } = req.params;
        if (!roomTypeId)
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        const roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType)
            return res.status(404).json({ error: "Loại phòng không tồn tại" });

        res.status(200).json(roomType.rooms);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const addHotel = async(req, res) => {
    try {
        /*
        serviceFacilities: [
            {
                category: "Tiện ích nổi bật",
                item: "Wifi miễn phí",
            },
        ]
        */

        const {
            name, lat, lng, address, cityName, rooms, description,
            serviceFacilities, policies, price, roomTypes
        } = req.body;

        if (
            !name || !address || !cityName || !rooms || !description ||
            !serviceFacilities || !policies || !price || !roomTypes || roomTypes.length === 0
        ){
            return res.status(400).json({error: "Thiếu thông tin bắt buộc hoặc chưa có loại phòng"});
        }
        //city
        const city = await City.findOne({name: cityName});
        if (!city){
            return res.status(400).json({error: "Thành phố chưa tồn tại"});
        }
        //facility
        const categoties = await HotelCategory.find({});
        const facilities = await HotelFacility.find({});
        const formattedFacilities = [];
        for (const facility of serviceFacilities){
            const category = categoties.find(cate => cate.name === facility.category);
            const item = facilities.find(fac => fac.name === facility.item);
            if (!category || !item){
                return res.status(400).json({error: "Tiện ích không tồn tại"});
            }
            let existingCategory = formattedFacilities.find(f => f.categoryId.equals(category._id));
            if (existingCategory){
                existingCategory.items.push(item._id);
            }
            else{
                formattedFacilities.push({
                    categoryId: category._id,
                    items: [item._id]
                });
            }
        }

        //roomType
        const roomTypeIds = [];
        for (const roomTypeData of roomTypes){
            const roomType = new HotelRoomType(roomTypeData);
            await roomType.save();
            roomTypeIds.push(roomType._id);
        }

        const newHotel = new Hotel({
            name, lat, lng, address, city: city._id, rooms, description,
            serviceFacilities: formattedFacilities, policies, price, roomTypes: roomTypeIds
        })

        await newHotel.save();
        res.status(201).json({ message: "Thêm khách sạn thành công", hotel: newHotel });

    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const updateHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const {
            name, lat, lng, address, cityName, rooms, description,
            serviceFacilities, policies, price
        } = req.body;

        let hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ error: "Khách sạn không tồn tại" });

        if (cityName) {
            const city = await City.findOne({ name: cityName });
            if (!city) return res.status(400).json({ error: "Thành phố chưa tồn tại" });
            hotel.city = city._id;
        }

        // Cập nhật tiện ích dịch vụ
        if (serviceFacilities) {
            const categories = await HotelCategory.find({});
            const facilities = await HotelFacility.find({});

            const formattedFacilities = [];
            for (const facility of serviceFacilities) {
                const category = categories.find(cate => cate.name === facility.category);
                const item = facilities.find(fac => fac.name === facility.item);
                if (!category || !item) {
                    return res.status(400).json({ error: "Tiện ích không tồn tại" });
                }

                let existingCategory = formattedFacilities.find(f => f.categoryId.equals(category._id));
                if (existingCategory) {
                    existingCategory.items.push(item._id);
                } else {
                    formattedFacilities.push({
                        categoryId: category._id,
                        items: [item._id]
                    });
                }
            }
            hotel.serviceFacilities = formattedFacilities;
        }

        // Cập nhật thông tin khác
        hotel.name = name || hotel.name;
        hotel.lat = lat || hotel.lat;
        hotel.lng = lng || hotel.lng;
        hotel.address = address || hotel.address;
        hotel.rooms = rooms || hotel.rooms;
        hotel.description = description || hotel.description;
        hotel.policies = policies || hotel.policies;
        hotel.price = price || hotel.price;

        await hotel.save();
        res.status(200).json({ message: "Cập nhật khách sạn thành công", hotel });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const addRoomType = async(req, res) => {
    try{
        const { hotelId } = req.params;
        const { name, area, view, roomFacilities, rooms} = req.body;
        if (!name || !rooms || rooms.length === 0) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc hoặc chưa có phòng nào" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: "Khách sạn không tồn tại" });
        }

        const newRoomType = new HotelRoomType({
            name, area, view,
            roomFacilities: roomFacilities || [],
            rooms,
        });

        await newRoomType.save();
        hotel.roomTypes.push(newRoomType._id);
        await hotel.save();

        res.status(201).json({message: "Thêm loại phòng thành công", newRoomType});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const updateRoomType = async (req, res) => {
    try {
        const { hotelId, roomTypeId } = req.params;
        const { name, area, view, roomFacilities } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ error: "Khách sạn không tồn tại" });
        let roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType) return res.status(404).json({ error: "Loại phòng không tồn tại" });

        roomType.name = name || roomType.name;
        roomType.area = area || roomType.area;
        roomType.view = view || roomType.view;
        roomType.roomFacilities = roomFacilities || roomType.roomFacilities;

        await roomType.save();
        res.status(200).json({ message: "Cập nhật loại phòng thành công", roomType });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const addRoom = async(req, res) => {
    try{
        const { roomTypeId } = req.params;
        const { bedType,  serveBreakfast, maxOfGuest, numberOfRoom , cancellationPolicy, price} = req.body;
    
        if(!bedType || !maxOfGuest || !numberOfRoom || !cancellationPolicy || !price)
            return res.status(400).json("Thiếu thông tin bắt buộc");
    
        const roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType)
            return res.status(400).json({ error: "Loại phòng không tồn tại" });
    
        const newRoom = {
            bedType, serveBreakfast: serveBreakfast,
            maxOfGuest: Number(maxOfGuest),
            numberOfRoom: Number(numberOfRoom),
            cancellationPolicy, price: Number(price),
        };
    
        roomType.rooms.push(newRoom);
        await roomType.save();
        res.status(201).json({ message: "Thêm phòng thành công", roomType });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const updateRoom = async (req, res) => {
    try {
        const { hotelId, roomTypeId, roomId } = req.params;
        const { bedType, serveBreakfast, maxOfGuest, numberOfRoom, cancellationPolicy, price } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ error: "Khách sạn không tồn tại" });
        const roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType) return res.status(404).json({ error: "Loại phòng không tồn tại" });
        const roomIndex = roomType.rooms.findIndex(room => room._id.equals(roomId));
        if (roomIndex === -1) return res.status(404).json({ error: "Phòng không tồn tại" });

        let room = roomType.rooms[roomIndex];
        room.bedType = bedType || room.bedType;
        room.serveBreakfast = serveBreakfast !== undefined ? serveBreakfast : room.serveBreakfast;
        room.maxOfGuest = maxOfGuest !== undefined ? Number(maxOfGuest) : room.maxOfGuest;
        room.numberOfRoom = numberOfRoom !== undefined ? Number(numberOfRoom) : room.numberOfRoom;
        room.cancellationPolicy = cancellationPolicy || room.cancellationPolicy;
        room.price = price !== undefined ? Number(price) : room.price;

        roomType.rooms[roomIndex] = room;
        await roomType.save();
        res.status(200).json({ message: "Cập nhật phòng thành công", roomType });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const checkAndDeleteHotel = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    if (hotel && hotel.roomTypes.length === 0) {
        await Hotel.findByIdAndDelete(hotelId);
        return true; // Khách sạn đã được xóa
    }
    return false; // Khách sạn vẫn còn loại phòng
};

const deleteRoom = async(req, res) => {
    try{
        const { hotelId, roomTypeId, roomId } = req.params;
        if (!hotelId || !roomTypeId || !roomId)
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });

        const hotel = await Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ error: "Khách sạn không tồn tại" });
        const roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType)
            return res.status(400).json({ error: "Loại phòng không tồn tại" });
        const roomIndex = roomType.rooms.findIndex(room => room._id.equals(roomId));
        if (roomIndex === -1)
            return res.status(404).json({ error: "Phòng không tồn tại" });

        roomType.rooms.splice(roomIndex, 1);
        await roomType.save();
        if (roomType.rooms.length === 0){
            await HotelRoomType.findByIdAndDelete(roomTypeId); // xóa luôn loại phòng
            // Xóa roomType khỏi danh sách roomTypes của hotel
            let roomTypeIndex = hotel.roomTypes.findIndex(id => id.equals(roomTypeId));
            hotel.roomTypes.splice(roomTypeIndex, 1);
            await hotel.save();
        }

        // Kiểm tra và xóa khách sạn nếu không còn loại phòng nào
        const isHotelDeleted = await checkAndDeleteHotel(hotelId);
        if (isHotelDeleted) {
            return res.status(200).json({ message: "Xóa phòng, loại phòng và khách sạn vì khách sạn không còn phòng" });
        }
        res.status(200).json({ message: "Xóa phòng thành công" , hotel});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const deleteRoomType = async (req, res) => {
    try {
        const { hotelId, roomTypeId } = req.params;
        if (!hotelId || !roomTypeId) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        }
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: "Khách sạn không tồn tại" });
        }
        const roomType = await HotelRoomType.findById(roomTypeId);
        if (!roomType) {
            return res.status(404).json({ error: "Loại phòng không tồn tại" });
        }

        // Xóa roomType khỏi danh sách roomTypes của hotel
        let roomTypeIndex = hotel.roomTypes.findIndex(id => id.equals(roomTypeId));
        hotel.roomTypes.splice(roomTypeIndex, 1);
        await hotel.save();
        await HotelRoomType.findByIdAndDelete(roomTypeId);

        const isHotelDeleted = await checkAndDeleteHotel(hotelId);
        if (isHotelDeleted) {
            return res.status(200).json({ message: "Xóa loại phòng và khách sạn vì khách sạn không còn phòng" });
        }

        res.status(200).json({ message: "Xóa loại phòng thành công", hotel });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const deleteHotel = async(req, res) => {
    try{
        const { hotelId } = req.params;
        if (!hotelId)
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
        const hotel = await Hotel.findById(hotelId);
        if (!hotel)
            return res.status(404).json({ error: "Khách sạn không tồn tại" });

        await HotelRoomType.deleteMany({ _id: { $in: hotel.roomTypes } });
        await Hotel.findByIdAndDelete(hotelId);
        res.status(200).json({ message: "Xóa khách sạn thành công" });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const getSearchHotelSuggestions = async (req, res) => {
    try{
        const { key } = req.query;
        // const searchKey = key.trim();
        const cities = await City.aggregate([
            {
                $search: {
                    index: "search_city",
                    text: {
                        query: key,
                        path: ["name"],
                        fuzzy: {},
                    },
                },
            },
            {
                $limit: 3,
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    stype: { $literal: "city" }, // Gắn loại city
                },
            },
        ]);

        const hotels = await Hotel.aggregate([
            {
                $search: {
                    index: "search_hotel",
                    text: {
                        query: key,
                        path: ["name", "address", "description"],
                        fuzzy: {},
                    },
                },
            },
            {
                $lookup: {
                    from: "cities",
                    localField: "city",
                    foreignField: "_id",
                    as: "cityDetails",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    city: 1,
                    cityName: { $arrayElemAt: ["$cityDetails.name", 0] },
                    stype: { $literal: "hotel" }, // Gắn loại hotel
                },
            },
        ]);

        const mergedResults = [...cities, ...hotels].sort((a, b) => a.name.localeCompare(b.name));
        res.status(200).json({ results: mergedResults });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const getSearchHotelResults = async (req, res) => {
    try{
        const {
            type,
            value,
            check_in,
            check_out,
            minPrice,
            maxPrice,
            hotelFacilities,
            roomFacilities,
            sort
        } = req.query;
        
        let filterStage = { $match: {} };
        if (type && value) {
            if (type == 'city') {
                const cityId = new mongoose.Types.ObjectId(String(value));
                filterStage.$match.city = cityId;
            } else if (type == 'hotel') {
                const hotelId = new mongoose.Types.ObjectId(String(value));
                filterStage.$match._id = hotelId;
            }
        }
        if (minPrice) filterStage.$match.price = { $gte: Number(minPrice) };
        if (maxPrice){
            filterStage.$match.price = {
                ...(filterStage.$match.price || {}),
                $lte: Number(maxPrice),
            };
        }
        if (hotelFacilities && hotelFacilities.length > 0) {
            const facilityIds = hotelFacilities.split(',').map(id => new mongoose.Types.ObjectId(String(id)));
            filterStage.$match["serviceFacilities.items"] = { $in: facilityIds };
        }
        
        if (roomFacilities && roomFacilities.length > 0) {
            filterStage.$lookup = {
                from: "hotelroomtypes",
                localField: "roomTypes",
                foreignField: "_id",
                as: "roomTypeDetails"
            };

            filterStage.$match["roomTypeDetails.roomFacilities"] = { $in: roomFacilities.split(',') };
        }

        let sortStage = {};
        if (sort === "new") {
            sortStage = { createdAt: -1 };
        } else if (sort === "rating") {
            sortStage = { averageRating: -1 };
        } else if (sort === "price") {
            sortStage = { price: -1 };
        }else {
            sortStage = { name: 1 };
        }

        const pageNumber = Number(req.query.page) || 1;
        const limit = 15;
        const skip = (pageNumber - 1) * limit;

        const results = await Hotel.aggregate([
            filterStage,
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    img: 1,
                    address: 1,
                    city: 1,
                    price: 1,
                    avgRating: 1,
                }
            }
        ]);

        res.json({
            hotels: results,
            totalPages: Math.ceil(results.length / limit),
            page: pageNumber,
            total: results.length,
        });
            
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const filterHotels = async (req, res) => {
    try{
        const {
            minPrice,
            maxPrice,
            hotelFacilities,
            roomFacilities,
            sort
        } = req.query;

        let filterStage = { $match: {} };
        if (minPrice) filterStage.$match.price = { $gte: Number(minPrice) };
        if (maxPrice){
            filterStage.$match.price = {
                ...(filterStage.$match.price || {}),
                $lte: Number(maxPrice),
            };
        }

        if (hotelFacilities && hotelFacilities.length > 0) {
            const facilityIds = hotelFacilities.split(',').map(id => new mongoose.Types.ObjectId(String(id)));
            filterStage.$match["serviceFacilities.items"] = { $in: facilityIds };
        }
        
        if (roomFacilities && roomFacilities.length > 0) {
            filterStage.$lookup = {
                from: "hotelroomtypes",
                localField: "roomTypes",
                foreignField: "_id",
                as: "roomTypeDetails"
            };

            filterStage.$match["roomTypeDetails.roomFacilities"] = { $in: roomFacilities.split(',') };
        }

        let sortStage = {};
        if (sort === "new") {
            sortStage = { createdAt: -1 };
        } else if (sort === "rating") {
            sortStage = { averageRating: -1 };
        } else if (sort === "price") {
            sortStage = { price: -1 };
        }else {
            sortStage = { name: 1 };
        }

        const pageNumber = Number(req.query.page) || 1;
        const limit = 15;
        const skip = (pageNumber - 1) * limit;

        const results = await Hotel.aggregate([
            filterStage,
            { $sort: sortStage },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    name: 1,
                    img: 1,
                    address: 1,
                    city: 1,
                    price: 1,
                    avgRating: 1,
                }
            }
        ]);

        res.json({
            hotels: results,
            totalPages: Math.ceil(results.length / limit),
            page: pageNumber,
            total: results.length,
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

export {
    listHotel,
    listRoomTypeByHotel,
    listRoomByRoomType,
    addHotel,
    addRoomType,
    addRoom,
    updateHotel,
    updateRoomType,
    updateRoom,
    deleteRoom,
    deleteRoomType,
    deleteHotel,
    getSearchHotelSuggestions,
    getSearchHotelResults,
    filterHotels
};