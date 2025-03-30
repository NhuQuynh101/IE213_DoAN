import Hotel from "../models/hotel.js";
import HotelRoomType from "../models/hotelRoomType.js";
import City from "../models/city.js"

const addHotel = async(req, res) => {
    try {
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
        const formattedFacilities = serviceFacilities.reduce((acc, facility) => {
            const category = acc.find(item => item.categoryId.toString() === facility.categoryId);
            if (category) {
                category.items.push(new mongoose.Types.ObjectId(facility.itemId));
            } else {
                acc.push({
                    categoryId: new mongoose.Types.ObjectId(facility.categoryId),
                    items: [new mongoose.Types.ObjectId(facility.itemId)]
                });
            }
            return acc;
        }, []);
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

const addRoomType = async(req, res) => {
    try{
        const { hotelId } = req.body;
        const { name, area, view, roomFacilities, availableRooms, rooms} = req.body;
        if (!name || !availableRooms || !rooms || rooms.length === 0) {
            return res.status(400).json({ error: "Thiếu thông tin bắt buộc hoặc chưa có phòng nào" });
        }

        const hotel = Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: "Khách sạn không tồn tại" });
        }

        const newRoomType = new HotelRoomType({
            name, area, view,
            roomFacilities: roomFacilities || [],
            availableRooms: Number(availableRooms) || 0,
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

const addRoom = async(req, res) => {
    try{
        const { roomTypeId } = req.body;
        const { bedType,  serveBreakfast, maxOfGuest , cancellationPolicy, price} = req.body;
    
        if(!bedType || !maxOfGuest || !cancellationPolicy || !price)
            return res.status(400).json("Thiếu thông tin bắt buộc");
    
        const roomType = HotelRoomType.findById(roomTypeId);
        if (!roomType)
            return res.status(400).json({ error: "Loại phòng không tồn tại" });
    
        const newRoom = {
            bedType, serveBreakfast: serveBreakfast || false,
            maxOfGuest: Number(maxOfGuest),
            cancellationPolicy, price: Number(price),
        };
    
        roomType.rooms.push(newRoom);
        await roomType.save();
        res.status(201).json({ message: "Thêm phòng thành công", room: newRoom });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }

}
