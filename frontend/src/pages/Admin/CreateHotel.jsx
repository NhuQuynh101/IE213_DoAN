import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css'; // Đừng quên import CSS cho Leaflet
import { useForm } from "react-hook-form";
import MapPicker from '../../components/MapPicker';
import { Select, TreeSelect } from 'antd';
import TextEditor from '../../components/TextEditor';
import RoomTypeModal from '../../components/RoomTypeModal';

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;


const cityOptions = [
    { value: 'TP HCM', label: 'TP HCM' },
    { value: 'Hà Nội', label: 'Hà Nội' },
];

const facilityOptions = [
    {
        title: "Tiện ích nổi bật",
        value: "Tiện ích nổi bật",
        children: [
            { title: "WiFi miễn phí", value: "WiFi miễn phí" },
            { title: "Bể bơi", value: "Bể bơi" },
        ],
    },
    {
        title: "Tổng quan",
        value: "Tổng quan",
        children: [
            { title: "Thang máy", value: "Thang máy" },
            { title: "Bãi đỗ xe", value: "Bãi đỗ xe" },
        ],
    },
];


const CreateHotel = () => {
    const [serviceFacilities, setServiceFacilities] = useState([]);
    const [showRoomTypeError, setShowRoomTypeError] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [isRoomTypeModalVisible, setIsRoomTypeModalVisible] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useForm();

    const handleFacilityChange = (values) => {
        let selectedFacilities = [];
        values.forEach((val) => {
            const parent = facilityOptions.find((option) =>
                option.children?.some((child) => child.value === val)
            );
    
            if (parent) {
                selectedFacilities.push({ category: parent.value, item: val });
            }
        });
        setServiceFacilities(selectedFacilities);
        setValue("serviceFacilities", selectedFacilities, { shouldValidate: true });
    };

    const handleEditorChange = (name, content) => {
        setValue(name, content, { shouldValidate: true });
    };

    const handleModalRoomType = (newRoomType) => {
        const prevRoomTypes = getValues('roomTypes') || [];
        setValue("roomTypes", [...prevRoomTypes, newRoomType], { shouldValidate: true });
        console.log(getValues("roomTypes"));
        setRoomTypes(getValues("roomTypes"));
        setIsRoomTypeModalVisible(false);
    };

    const renderRoomTypeErrors = () => {
        const roomTypes = getValues("roomTypes");
    
        if (!roomTypes || roomTypes.length === 0) {
            return (
                <p className="text-red-500 text-sm mt-1">
                    Vui lòng thêm ít nhất một loại phòng và 1 phòng
                </p>
            );
        }
        
        return null;
    };

    const onSubmit = (data) => {
        const roomTypes = getValues("roomTypes");
        if (!Array.isArray(roomTypes)) {
            setShowRoomTypeError(true);
            return;
        }
    
        console.log(data);
    };

    return (
        <div className='bg-softBlue min-h-screen p-4 md:p-8'>
            <p className='font-semibold text-[20px] md:text-[24px]'>Thêm khách sạn</p>
            <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <label className="block font-medium mb-2">
                            Tên khách sạn
                            <span className="text-red-500">*</span>
                        </label>
                        
                        <input
                            type="text"
                            placeholder="Nhập tên khách sạn"
                            {...register('name', { required: "Tên là bắt buộc" } )}
                            className={`w-full border p-2 rounded ${
                                errors['name'] ? "border-red-500" : "border-gray-300"
                            }`}
                        ></input>
                        {errors["name"] && (
                            <p className="text-red-500 text-sm mt-1">{errors["name"]?.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block font-medium mb-2">
                            Mô tả
                            <span className="text-red-500">*</span>
                        </label>
                        
                        <textarea
                            rows={4}
                            placeholder="Nhập mô tả"
                            {...register('description', { required: "Mô tả là bắt buộc" })}
                            className={`w-full border p-2 rounded ${
                                errors['description'] ? "border-red-500" : "border-gray-300"
                            }`}
                        ></textarea>
                        {errors["description"] && (
                            <p className="text-red-500 text-sm mt-1">{errors["description"]?.message}</p>
                        )}
                    </div>

                    <div className="">
                        <MapPicker
                            form={{ register, errors, getValues, setValue}}
                        ></MapPicker>
                    </div>

                    <div className='flex gap-5 mb-3'>
                        <div className="flex-1">
                            <label className="block font-medium mb-2 mr-4">
                                Thành phố
                                <span className="text-red-500">*</span>
                            </label>
                            <div>
                                <Select
                                    {...register('cityName', { required: 'Thành phố là bắt buộc' })}
                                    onChange={(value) => setValue('cityName', value, { shouldValidate: true })}
                                    placeholder="Chọn thành phố"
                                    className={`w-full ${errors['cityName'] ? 'border-red-500' : ''} border rounded border-gray-300`}
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {cityOptions.map((city) => (
                                        <Option key={city.value} value={city.value}>
                                            {city.label}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            {errors['cityName'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['cityName']?.message}</p>
                            )}
                        </div>

                        <div className="">
                            <label className="block font-medium mb-2">
                                Số phòng
                                <span className="text-red-500">*</span>
                            </label>
                            
                            <input
                                type="number"
                                placeholder="Nhập số lượng phòng"
                                {...register('rooms', { required: "Số phòng là bắt buộc" })}
                                className={`w-full border p-2 rounded ${
                                    errors['rooms'] ? "border-red-500" : "border-gray-300"
                                }`}
                            ></input>
                            {errors["rooms"] && (
                                <p className="text-red-500 text-sm mt-1">{errors["rooms"]?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 mb-6">
                        <label className="block font-medium mb-2 mr-4">
                            Cơ sở vật chất và dịch vụ
                            <span className="text-red-500">*</span>
                        </label>
                        
                        <div>
                            <TreeSelect
                                {...register("serviceFacilities", { required: "Cơ sở vật chất là bắt buộc" })}
                                onChange={handleFacilityChange}
                                placeholder="Chọn cơ sở vật chất và dịch vụ"
                                className={`w-full ${errors["serviceFacilities"] ? "border-red-500" : ""} border rounded border-gray-300`}
                                size="large"
                                treeData={facilityOptions}
                                treeDefaultExpandAll
                                multiple
                                showCheckedStrategy={SHOW_PARENT}
                            />
                        </div>
                        {errors['serviceFacilities'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['serviceFacilities']?.message}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">Chính sách chỗ lưu trú</h3>
                        <div className='grid grid-cols-2 gap-5 mb-3'>
                            <div className="mb-3">
                                <label className="block font-medium mb-2">
                                    Giờ Check-in
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    {...register("policies.timeCheckin", { required: "Giờ check-in là bắt buộc" })}
                                    className={`w-full border p-2 rounded ${errors.policies?.timeCheckin ? "border-red-500" : "border-gray-300"}`}
                                />
                                {errors.policies?.timeCheckin && <p className="text-red-500 text-sm mt-1">{errors.policies.timeCheckin.message}</p>}
                            </div>

                            <div className="mb-3">
                                <label className="block font-medium mb-2">
                                    Giờ Check-out
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    {...register("policies.timeCheckout", { required: "Giờ check-out là bắt buộc" })}
                                    className={`w-full border p-2 rounded ${errors.policies?.timeCheckout ? "border-red-500" : "border-gray-300"}`}
                                />
                                {errors.policies?.timeCheckout && <p className="text-red-500 text-sm mt-1">{errors.policies.timeCheckout.message}</p>}
                            </div>
                        </div>

                        <TextEditor
                            label="Chính sách Check-in"
                            name="policies.checkinPolicy"
                            value={watch("policies.checkinPolicy")}
                            onChange={handleEditorChange}
                            error={errors.policies?.checkinPolicy?.message}
                        ></TextEditor>

                        <TextEditor
                            label="Chính sách trẻ em"
                            name="policies.childrenPolicy"
                            value={watch("policies.childrenPolicy")}
                            onChange={handleEditorChange}
                            error={errors.policies?.childrenPolicy?.message}
                        ></TextEditor>

                        <TextEditor
                            label="Phí bắt buộc"
                            name="policies.mandatoryFees"
                            value={watch("policies.mandatoryFees") || ""}
                            onChange={handleEditorChange}
                            error={errors.policies?.mandatoryFees?.message}
                        />

                        <TextEditor
                            label="Phí khác"
                            name="policies.otherFees"
                            value={watch("policies.otherFees") || ""}
                            onChange={handleEditorChange}
                            error={errors.policies?.otherFees?.message}
                        />

                        <TextEditor
                            label="Đồ ăn & Thức uống"
                            name="policies.FoodDrinks"
                            value={watch("policies.FoodDrinks") || ""}
                            onChange={handleEditorChange}
                            error={errors.policies?.FoodDrinks?.message}
                        />

                        <div className="mb-6">
                            <label className="block font-medium mb-2 mr-4">
                                Chính sách vật nuôi
                            </label>
                            <div>
                                <Select
                                    {...register("policies.allowPet")}
                                    onChange={(value) => setValue('policies.allowPet', value, { shouldValidate: true })}
                                    placeholder="Chọn"
                                    className={`w-full border rounded border-gray-300`}
                                    size="large"
                                >
                                    <Option  value="Cho phép">
                                        Cho phép
                                    </Option>
                                    <Option value="Không cho phép">
                                        Không cho phép
                                    </Option>
                                </Select>
                            </div>
                            
                        </div>
                    </div>
                    
                    {/* Thêm phòng và loại phòng */}
                    <div>
                        {roomTypes.length > 0 && <h3 className="font-semibold text-lg mb-3">Danh sách loại phòng</h3>}
                        {roomTypes.map((roomType, index) => (
                            <div key={index} className='p-4 border rounded mb-4 space-y-1'>
                                <h3>Tên loại phòng: {roomType.name}</h3>
                                <p>Diện tích: {roomType.area} m²</p>
                                <p>Hướng: {roomType.view}</p>
                                <span>Cơ sở vật chất: </span>
                                {roomType.roomFacilities?.map((facility, key) => (
                                    <span key={key} className='p-1 bg-green-100 rounded mr-1'>{facility}</span>
                                ))}

                                {roomType.rooms.length > 0 && <h3 className="font-semibold text-[16px] mb-3">Danh sách phòng</h3>}
                                {roomType.rooms.map((room, roomIndex) => (
                                    <div key={roomIndex} className='p-2 rounded space-y-1 bg-slate-50'>
                                        <p>Loại giường: {room.bedType}</p>
                                        <p>Giá: {room.price.toLocaleString()} VNĐ</p>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => setIsRoomTypeModalVisible(true)}
                            className="border-[1.5px] border-blue-500 border-dashed text-blue-500 text-[14px] p-2 rounded mb-5"
                        >
                            + Thêm loại phòng
                        </button>



                        {/* Modal nhập loại phòng */}
                        <RoomTypeModal
                            visible={isRoomTypeModalVisible}
                            onCancel={() => setIsRoomTypeModalVisible(false)}
                            onOk={handleModalRoomType}
                            setValue={setValue}
                            getValues={getValues}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Thêm Tour
                    </button>
                    {showRoomTypeError && renderRoomTypeErrors()}
                </form>
            </div>
        </div>
    );
}

export default CreateHotel;