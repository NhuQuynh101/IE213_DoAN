import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import MapPicker from '../../components/MapPicker';
import { Select, TreeSelect, message } from 'antd';
import TextEditor from '../../components/TextEditor';
import RoomTypeModal from '../../components/RoomTypeModal';
import RoomModal from '../../components/RoomModal';
import UploadImg from '../../components/UploadImg';
import { useUploadImagesMutation } from '../../redux/api/uploadApiSlice';

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
    const [images, setImages] = useState([]);
    const [isRoomTypeModalVisible, setIsRoomTypeModalVisible] = useState(false);
    const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
    const [showRoomTypeError, setShowRoomTypeError] = useState(false);
    const [roomTypesId, setRoomTypesId] = useState();
    const {
        register, handleSubmit, control, formState: { errors },
        getValues, setValue, watch, reset
    } = useForm(
        {
            defaultValues: {
                name: "",
                description: "",
                address: "",
                cityName: undefined,
                lat: undefined,
                lng: undefined,
                rooms: undefined,
                serviceFacilities: [],
                policies: {
                    timeCheckin: "",
                    timeCheckout: "",
                    checkinPolicy: "",
                    childrenPolicy: "",
                    mandatoryFees: "",
                    otherFees: "",
                    FoodDrinks: "",
                    allowPet: ""
                },
                img: [],
                roomTypes: []
            }
        }
    );
    const roomTypes = watch("roomTypes");
    const { append: appendRoomType, update: updateRoomType, remove: removeRoomType } = useFieldArray({
        control,
        name: 'roomTypes'
    });

    const [ uploadHotelImages, { isLoading: isUploadLoading, isError: isUploadError, isSuccess } ] = useUploadImagesMutation();

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
        setValue("serviceFacilities", selectedFacilities, { shouldValidate: true });
    };

    const handleEditorChange = (name, content) => {
        setValue(name, content, { shouldValidate: true });
    };

    const handleModalRoomType = (newRoomType) => {
        appendRoomType(newRoomType);
        // console.log(getValues("roomTypes"));
        setIsRoomTypeModalVisible(false);
    };

    const handleModalRoom = (newRoom) => {
        const roomTypes = getValues("roomTypes");
        const updatedRoomType = {
            ...roomTypes[roomTypesId],
            rooms: [...(roomTypes[roomTypesId].rooms || []), newRoom],
        };
        updateRoomType(roomTypesId, updatedRoomType);
        // console.log(getValues("roomTypes"));
        setIsRoomModalVisible(false);
    };

    const renderRoomTypeErrors = () => {
        return (
            <p className="text-red-500 text-sm mt-1">
                Vui lòng thêm ít nhất một loại phòng và 1 phòng cho mỗi loại phòng
            </p>
        );
    };

    const handleInputFileChange = (update) => {
        setImages(update);
    }

    const uploadImagesToCloudinary = async () => {
        try {
            const res = await uploadHotelImages({ data: images}).unwrap();
            // console.log(res);
            return res;
        } catch (error) {
            console.log(error)
        }
    }
    
    const onSubmit = async (data) => {
        const roomTypes = getValues("roomTypes");
        if (
            !Array.isArray(roomTypes) ||
            roomTypes.length === 0 ||
            roomTypes.some((roomType) => !Array.isArray(roomType?.rooms) || roomType.rooms.length === 0)
        ) {
            setShowRoomTypeError(true);
            return;
        }
        const uploadedImgs =  await uploadImagesToCloudinary();
        data.img = uploadedImgs;
        setImages([]);
        setShowRoomTypeError(false);
        console.log(data);
        

        // reset(); // Từ useForm
    };

    const [messageApi, contextMessageHolder] = message.useMessage();
    useEffect(() => {
        if (isUploadLoading) {
            messageApi.open({
                key: 'uploading',
                type: 'loading',
                content: 'Đang tải ảnh lên...',
                duration: 0,
            });
        }
        if (isUploadError) {
            messageApi.open({
                key: 'uploading',
                type: 'error',
                content: 'Tải ảnh thất bại!',
                duration: 2,
            });
        }
        if (isSuccess) {
            messageApi.open({
                key: 'uploading',
                type: 'success',
                content: 'Thêm khách sạn thành công!',
                duration: 2,
            })
        }
    }, [isUploadLoading, isUploadError, isSuccess]);

    return (
        <div className='bg-softBlue min-h-screen p-4 md:p-8'>
            {contextMessageHolder}
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
                        <MapPicker form={{ register, errors, getValues, setValue }} />
                    </div>

                    <div className='flex gap-5 mb-3'>
                        <div className="flex-1">
                            <label className="block font-medium mb-2 mr-4">
                                Thành phố
                                <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="cityName"
                                control={control}
                                rules={{ required: "Thành phố là bắt buộc" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Chọn thành phố"
                                        size="large"
                                        showSearch
                                        optionFilterProp="children"
                                        className='border rounded border-gray-300 w-full'
                                    >
                                        {cityOptions.map((city) => (
                                            <Option key={city.value} value={city.value}>
                                                {city.label}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
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

                        <Controller
                            name="serviceFacilities"
                            control={control}
                            rules={{ required: "Cơ sở vật chất là bắt buộc" }}
                            render={({ field }) => (
                                <TreeSelect
                                    {...field}
                                    value={serviceFacilities}
                                    onChange={(value) => {
                                        setServiceFacilities(value); //set lại để hiện ra
                                        handleFacilityChange(value);
                                    }}
                                    placeholder="Chọn cơ sở vật chất và dịch vụ"
                                    className={`w-full ${errors["serviceFacilities"] ? "border-red-500" : ""} border rounded border-gray-300`}
                                    size="large"
                                    treeData={facilityOptions}
                                    treeDefaultExpandAll
                                    multiple
                                    showCheckedStrategy={SHOW_PARENT}
                                />
                            )}
                        />
                        {errors['serviceFacilities'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['serviceFacilities']?.message}</p>
                        )}
                    </div>

                    <div className=''>
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
                            <Controller
                                name="policies.allowPet"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder="Chọn"
                                        className={`w-full border rounded border-gray-300`}
                                        size="large"
                                    >
                                        <Option value="Cho phép">Cho phép</Option>
                                        <Option value="Không cho phép">Không cho phép</Option>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    
                    {/* Thêm phòng và loại phòng */}
                    <div className=''>
                        {roomTypes?.length > 0 && (
                            <h3 className="font-semibold text-lg mb-3">Danh sách loại phòng</h3>
                        )}
                        {roomTypes?.map((roomType, index) => (
                            <div key={index} className='p-4 border rounded mb-4'>
                                <h3>Tên loại phòng: {roomType.name}</h3>
                                <p>Diện tích: {roomType.area} m²</p>
                                <p>Hướng: {roomType.view}</p>
                                <span>Cơ sở vật chất: </span>
                                {roomType.roomFacilities?.map((facility, key) => (
                                    <span key={key} className='p-1 bg-green-100 rounded mr-1'>{facility}</span>
                                ))}

                                {roomType.rooms?.length > 0 && (
                                    <h3 className="font-semibold text-[16px] mt-3 mb-1">Danh sách phòng</h3>
                                )}
                                {roomType.rooms?.map((room, roomIndex) => (
                                    <div key={roomIndex} className="relative p-2 rounded my-2 bg-slate-50 border">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const path = `roomTypes.${index}.rooms`;
                                                const updatedRooms = [...(roomType.rooms || [])];
                                                updatedRooms.splice(roomIndex, 1);
                                                setValue(path, updatedRooms);
                                            }}
                                            className="absolute top-1 right-1 px-1 text-red-500 hover:text-red-700 text-sm"
                                        >
                                            ✕
                                        </button>
                                        <p>Loại giường: {room.bedType}</p>
                                        <p>Giá: {room.price.toLocaleString()} VNĐ</p>
                                    </div>
                                ))}

                                <div className='flex justify-end mt-3'>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRoomTypesId(index);
                                            setIsRoomModalVisible(true);
                                        }}
                                        className="text-sm rounded bg-blue-400 text-white px-2 py-1 mr-2"
                                    >
                                        Thêm phòng
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeRoomType(index)}
                                        className="text-sm rounded bg-red-400 text-white px-2 py-1"
                                    >
                                        Xóa loại phòng
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <UploadImg
                        label="Thêm hình ảnh của khách sạn"
                        filesData={images}
                        onChange={handleInputFileChange}
                    />
                    
                    <div className='flex gap-5 justify-end'>
                        <button
                            type="button"
                            onClick={() => setIsRoomTypeModalVisible(true)}
                            className="border-[1.5px] border-blue-500 border-dashed text-blue-500 text-[14px] p-2 rounded"
                        >
                            + Thêm loại phòng
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            Thêm khách sạn
                        </button>
                    </div>

                    {/* Modal nhập loại phòng */}
                    <RoomTypeModal
                        visible={isRoomTypeModalVisible}
                        onCancel={() => setIsRoomTypeModalVisible(false)}
                        onOk={handleModalRoomType}
                        setValue={setValue}
                        getValues={getValues}
                    />
                    {/* Modal nhập phòng */}
                    <RoomModal
                        visible={isRoomModalVisible}
                        onCancel={() => setIsRoomModalVisible(false)}
                        onOk={handleModalRoom}
                    />
                    {showRoomTypeError && renderRoomTypeErrors()}
                </form>
            </div>
        </div>
    );
}

export default CreateHotel;