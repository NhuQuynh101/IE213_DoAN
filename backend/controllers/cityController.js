import mongoose from "mongoose";
import City from "../models/city.js";

const listCity = async(req, res) => {
    try{
        const cities = await City.find({});
        res.status(200).json(cities);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const addCity = async(req, res) => {
    try {
        const {name, description, bestTimeToVisit} = req.body;
        if (!name || !description || !bestTimeToVisit) {
            return res.status(400).json({ error: "Không được để trống" });
        }
        
        const existingCity = await City.findOne({ name });
        if (existingCity) {
            return res.status(400).json({ error: "Thành phố đã tồn tại" });
        }
        const newCity = new City({name, description, bestTimeToVisit, popularPlace: [], img: []});
        await newCity.save();
        res.status(201).json(newCity);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const addPopularPlace = async(req, res) => {
    try {
        const { cityId } = req.params;
        const {name, description} = req.body;
        if (!cityId || !name || !description) return res.status(400).json({ error: "Không được để trống" });

        const city = await City.findById(cityId);
        if (!city) return res.status(400).json({ error: "Thành phố không tồn tại" });
        
        city.popularPlace.push({name, description});
        await city.save();
        res.status(201).json(city);
    }
    catch(error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const removeCity = async (req, res) => {
    try {
        const { cityId } = req.params;

        const city = await City.findById(cityId);
        if (!city) return res.status(400).json({ error: "Thành phố không tồn tại" });

        const remove = await City.findByIdAndDelete(cityId);
        res.status(200).json({ message: "Đã xóa thành phố thành công", remove });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const removePopularPlace = async (req, res) => {
    try {
        const { cityId, placeId } = req.params;

        const city = await City.findById(cityId);
        if (!city) {
            return res.status(400).json({ error: "Thành phố không tồn tại" });
        }

        const placeIndex = city.popularPlace.findIndex(place => place._id.toString() === placeId);
        if (placeIndex === -1) {
            return res.status(400).json({ error: "Địa điểm không tồn tại" });
        }

        city.popularPlace.splice(placeIndex, 1);

        await city.save();
        res.status(200).json({ message: "Đã xóa địa điểm thành công", city });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

export {
    listCity,
    addCity,
    addPopularPlace,
    removeCity,
    removePopularPlace
};