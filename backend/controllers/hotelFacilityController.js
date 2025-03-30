import mongoose from "mongoose";
import HotelFacility from "../models/hotelFacility.js";
import HotelCategory from "../models/hotelCategory.js";

const listFacility = async (req, res) => {
    try {
        const facilities = await HotelFacility.find().populate("category", "name");

        if (facilities.length === 0) {
            return res.json({ error: "Không có facility nào." });
        }
        res.json(facilities);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const groupFacilityByCategory = async (req, res) => {
    try{
        const categories = await HotelCategory.find();
        const facilities = await HotelFacility.find();

        const group = categories.map((category) => ({
        title: category.name,
        value: category._id,
        children: facilities
            .filter((facility) => facility.category.toString() === category._id.toString())
            .map((facility) => ({
                title: facility.name,
                value: facility._id,
            })),
        }));

        res.status(200).json(group);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const listFacilityByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({ error: "Không tìm thấy categoryId" });
        }

        const facilities = await HotelFacility.find({ category: categoryId }).populate("category", "name");
        if (facilities.length === 0) {
            return res.json({ error: "Không có facility" });
        }

        res.status(200).json(facilities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const addFacility = async (req, res) => {
    try {
        const {categoryName, facilityName} = req.body;
        if (!facilityName || !categoryName) {
            return res.status(400).json({ error: "Không được bỏ trống" });
        }

        const existingFacility = await HotelFacility.findOne({ facilityName });
        if (existingFacility) {
            return res.status(400).json({ error: "Facility đã tồn tại" });
        }

        let category = await HotelCategory.findOne({name: categoryName})
        if (!category) {
            // Nếu category chưa tồn tại, tạo mới
            category = new HotelCategory({ name: categoryName });
            await category.save();
        }

        const facility = new HotelFacility({category: category._id, name: facilityName});
        await facility.save();
        res.status(201).json(facility);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

const removeFacility = async(req, res) => {
    try{
        const { facilityId } = req.params;

        const facility = await HotelFacility.findById(facilityId);
        if (!facility) {
            return res.status(400).json({ error: "Facility không tồn tại" });
        }

        const categoryId = facility.category;

        const removed = await HotelFacility.findByIdAndDelete(facilityId);

        const remainingFacilities = await HotelFacility.find({ category: categoryId });

        if (remainingFacilities.length === 0) {
            await HotelCategory.findByIdAndDelete(categoryId);
        }

        res.status(200).json({ message: "Xoá thành công", removed });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: "Lỗi server" });
    }
}

export {
    listFacility,
    groupFacilityByCategory,
    listFacilityByCategory,
    addFacility,
    removeFacility,
};