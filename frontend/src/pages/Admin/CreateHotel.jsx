import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import MapPicker from '../../components/MapPicker';
import { Select, TreeSelect, message } from 'antd';
import UploadImg from '../../components/UploadImg';
import { useUploadImagesMutation, useDeleteImageMutation } from '../../redux/api/uploadApiSlice';
import FormInput from '../../components/FormInput';
import FormTextArea from '../../components/FormTextArea';
import FormSelect from '../../components/FormSelect';
import TextEditor from './TextEditor';
import RoomTypeModal from '../../components/RoomTypeModal';
import RoomModal from '../../components/RoomModal';

const { Option } = Select;
const { SHOW_PARENT } = TreeSelect;

const cityOptions = [
    {
        _id: 1,
        name: "Thành phố HCM",
    },
    {
        _id: 2,
        name: "Hà Nội",
    },
    {
        _id: 3,
        name: "Đà Nẵng",
    },
];

const petPolicyOptions = [
    {
        _id: 1,
        name: "Cho phép",
    },
    {
        _id: 2,
        name: "Không cho phép",
    }
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


const CreateHotel = ({ hotelData }) => {
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
                    timeCheckin: "12:30",
                    timeCheckout: "12:30",
                    checkinPolicy: "",
                    childrenPolicy: "",
                    mandatoryFees: "",
                    otherFees: "",
                    FoodDrinks: "",
                    allowPet: ""
                },
                img: hotelData?.img || [],
                roomTypes: []
            }
        }
    );
    const { append: appendRoomType, remove: removeRoomType, update: updateRoomType } = useFieldArray({
        control,
        name: 'roomTypes'
    });

    const [serviceFacilities, setServiceFacilities] = useState([]);
    const [showRoomTypeError, setShowRoomTypeError] = useState(false);
    const [isRoomTypeModalVisible, setIsRoomTypeModalVisible] = useState(false);
    const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
    const [editingRoomType, setEditingRoomType] = useState(null);
    const [editingRoomTypeIndex, setEditingRoomTypeIndex] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingRoomIndex, setEditingRoomIndex] = useState(null);
    const [images, setImages] = useState([]);
    const [uploadImgKey, setUploadImgKey] = useState(0);
    const [modalKey, setModalKey] = useState(0);
    const [modalRoomKey, setModalRoomKey] = useState(0);
    const [step, setStep] = useState(1);

    const [ uploadHotelImages, { isLoading: isUploadLoading, isError: isUploadError, isSuccess } ] = useUploadImagesMutation();
    const [ deleteHotelImage ] = useDeleteImageMutation();

    const handleImagesChange = async ({ newImages, deletedExisting }) => {
        if (deletedExisting) {
            await deleteImagesFromCloudinary(deletedExisting);
        }
        setImages(newImages?.map(img => img.base64) || []);
        console.log(images);
        console.log(getValues("img"));
    }
    
    const uploadImagesToCloudinary = async (images) => {
        if (images.length === 0) return [];
        try {
            const res = await uploadHotelImages({ data: images }).unwrap();
            return res;
        } catch (error) {
            console.log(error)
        }
    }
    const deleteImagesFromCloudinary = async (publicId) => {
        if (!publicId) return;
        try {
            await deleteHotelImage(publicId).unwrap()
            setValue("img", getValues("img").filter(id => id !== publicId));
        } catch (error) {
            console.log(error)
        }
    }
    
    const onSubmit = async (data) => {
        // const roomTypes = getValues("roomTypes");
        // if (
        //     !Array.isArray(roomTypes) ||
        //     roomTypes.length === 0 ||
        //     roomTypes.some((roomType) => !Array.isArray(roomType?.rooms) || roomType.rooms.length === 0)
        // ) {
        //     setShowRoomTypeError(true);
        //     return;
        // }
        const uploadedImgs =  await uploadImagesToCloudinary(images);
        data.img = [...getValues("img"), ...uploadedImgs]
        setUploadImgKey(prev => prev + 1);
        setImages([]);
        
        setShowRoomTypeError(false);
        console.log(data);
    };

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

    const renderRoomTypeErrors = () => {
        return (
            <p className="text-red-500 text-sm mt-1">
                Vui lòng thêm ít nhất một loại phòng và 1 phòng cho mỗi loại phòng
            </p>
        );
    };

    const formHotel = () => {
        return (
            <div>
                <p className='font-semibold text-[20px] md:text-[24px]'>Thêm khách sạn</p>
                <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6 '>
                    <form id='hotelForm'>
                        <FormInput
                            label={"Tên khách sạn"}
                            name={"name"}
                            register={register}
                            errors={errors}
                            placeholder={"Nhập tên khách sạn"}
                        // validationRules = {{required: "Tên là bắt buộc"}}
                        />
                        <FormTextArea
                            label={"Mô tả"}
                            name={"description"}
                            register={register}
                            errors={errors}
                            placeholder={"Nhập mô tả"}
                            // validationRules={{ required: "Mô tả là bắt buộc" }}
                            row={4}
                        />
                        <div className="">
                            <MapPicker
                                form={{
                                    register,
                                    errors,
                                    getValues,
                                    setValue
                                }}
                            // validationRules = {{required: "Địa chỉ là bắt buộc" }}
                            />
                        </div>
                        <div className='flex gap-5 mb-3'>
                            <FormSelect
                                label={"Thành phố"}
                                name={"cityName"}
                                control={control}
                                options={cityOptions}
                                placeholder={"Chọn thành phố"}
                                // validationRules={{ required: "Thành phố là bắt buộc" }}
                                valueField="_id"
                                labelField="name"
                                errors={errors}
                                className='flex-1'
                            />
                            <FormInput
                                label={"Số phòng"}
                                type={"number"}
                                name={"rooms"}
                                register={register}
                                errors={errors}
                                placeholder={"Nhập số lượng phòng"}
                            // validationRules = {{ required: "Số phòng là bắt buộc" }}
                            />
                        </div>
                        <div className="flex-1 mb-6">
                            <label className="block font-medium mb-2 mr-4">
                                Cơ sở vật chất và dịch vụ
                                <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="serviceFacilities"
                                control={control}
                                // rules={{ required: "Cơ sở vật chất là bắt buộc" }}
                                render={({ field }) => (
                                    <TreeSelect
                                        {...field}
                                        value={serviceFacilities}
                                        onChange={(value) => {
                                            setServiceFacilities(value);
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
                        <div className='space-y-5'>
                            <h3 className="font-semibold text-lg">Chính sách chỗ lưu trú</h3>
                            <div className='grid grid-cols-2 gap-5 mb-3'>
                                <div className="">
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

                                <div className="">
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
                                label={"Chính sách Check-in"}
                                name={"policies.checkinPolicy"}
                                control={control}
                                placeholder={"Nhập chính sách check-in"}
                                errors={errors}
                            />

                            <TextEditor
                                label={"Chính sách trẻ em"}
                                name={"policies.childrenPolicy"}
                                control={control}
                                placeholder={"Nhập chính sách trẻ em"}
                                errors={errors}
                            />

                            <TextEditor
                                label={"Phí bắt buộc"}
                                name={"policies.mandatoryFees"}
                                control={control}
                                placeholder={"Nhập các chính sách về phí bắt buộc"}
                                errors={errors}
                            />
                            <TextEditor
                                label={"Đồ ăn & Thức uống"}
                                name={"policies.FoodDrinks"}
                                control={control}
                                placeholder={"Nhập các chính sách về đồ ăn & thức uống"}
                                errors={errors}
                            />
                            <TextEditor
                                label={"Phí khác"}
                                name={"policies.otherFees"}
                                control={control}
                                placeholder={"Nhập các chính sách về phí khác"}
                                errors={errors}
                            />

                            <FormSelect
                                label={"Chính sách vật nuôi"}
                                name={"policies.allowPet"}
                                control={control}
                                options={petPolicyOptions}
                                placeholder={"Chọn"}
                                valueField="name"
                                labelField="name"
                                errors={errors}
                            />
                        </div>

                        <UploadImg
                            label="Ảnh khách sạn"
                            existingImages={watch("img") || []}
                            onImagesChange={handleImagesChange}
                            key={uploadImgKey}
                        />

                        <div className='flex gap-5 justify-end'>
                            <button
                                type="button"
                                className="bg-blue-500 text-white p-2 rounded"
                                onClick={() => {
                                    setStep(2);
                                }}
                            >
                                Tiếp tục thêm loại phòng và phòng
                            </button>
                        </div>
                        {showRoomTypeError && renderRoomTypeErrors()}
                    </form>
                </div>
            </div>
        )
    }

    const formRoomType = () => {
        const roomTypes = watch('roomTypes')
        const handleOpenModalRoomType = () => {
            setEditingRoomType(null);
            setEditingRoomTypeIndex(null);
            setModalKey((prev) => prev + 1)
            setIsRoomTypeModalVisible(true)
        }
        const handleCloseModalRoomType = () => {
            setEditingRoomType(null);
            setEditingRoomTypeIndex(null);
            setIsRoomTypeModalVisible(false);
        }
        const handleAddRoomType = (newRoomType) => {
            appendRoomType(newRoomType);
            handleCloseModalRoomType();
        }
        const handleRemoveRoomType = (index) => {
            removeRoomType(index)
        }
        const handleEditRoomType = (roomType, index) => {
            setEditingRoomTypeIndex(index);
            setEditingRoomType(roomType);
            setModalKey((prev) => prev + 1)
            // console.log(modalKey);
            setIsRoomTypeModalVisible(true);
        }
        const handleUpdateRoomType = (updatedRoomType) => {
            const updateRoomTypes = [...roomTypes];
            updateRoomTypes[editingRoomTypeIndex] = updatedRoomType
            setValue("roomTypes", updateRoomTypes)
            handleCloseModalRoomType();
        }


        const handleOpenRoomModal = (roomType, index) => {
            setEditingRoomTypeIndex(index)
            setEditingRoomType(roomType)
            setModalRoomKey((prev) => prev + 1)
            setIsRoomModalVisible(true)
        }
        const handleCloseRoomModal = () => {
            setEditingRoomTypeIndex(null);
            setEditingRoomType(null);
            setEditingRoomIndex(null);
            setEditingRoom(null)
            setIsRoomModalVisible(false)
        }
        const handleAddRoom = (newRoom) => {
            const roomTypes = getValues("roomTypes");
            const updatedRoomType = {
                ...roomTypes[editingRoomTypeIndex],
                rooms: [...(roomTypes[editingRoomTypeIndex].rooms || []), newRoom],
            };
            updateRoomType(editingRoomTypeIndex, updatedRoomType);
            handleCloseRoomModal();
        }
        const handleRemoveRoom = (index, roomType, roomIndex) => {
            const updatedRooms = [...(roomType.rooms || [])];
            updatedRooms.splice(roomIndex, 1);

            const roomTypes = getValues("roomTypes");
            const updatedRoomType = {
                ...roomTypes[index],
                rooms: [...updatedRooms],
            };
            updateRoomType(index, updatedRoomType);
        }
        const handleEditRoom = (index, roomType, roomIndex, room) => {
            setEditingRoomTypeIndex(index);
            setEditingRoomType(roomType);
            setEditingRoomIndex(roomIndex);
            setEditingRoom(room)
            setModalRoomKey((prev) => prev + 1)
            setIsRoomModalVisible(true)
        }
        const handleUpdateRoom = (updatedRoom) => {
            const roomTypes = getValues("roomTypes");
            const currentRoomType = roomTypes[editingRoomTypeIndex];
            const updatedRooms = [...(currentRoomType.rooms || [])];
            updatedRooms[editingRoomIndex] = updatedRoom;

            const updatedRoomType = {
                ...currentRoomType,
                rooms: updatedRooms,
            };
            updateRoomType(editingRoomTypeIndex, updatedRoomType);
            handleCloseRoomModal();
        }


        return (
            <div>
                <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6 '>
                    <div className="flex items-baseline justify-between py-4 border-b">
                        <h2 className="font-semibold text-lg text-">
                            Thông tin loại phòng và phòng
                        </h2>
                        <button
                            onClick={() => handleOpenModalRoomType() }
                            type="button"
                            className="font-medium border-[2px] border-blue-500 border-dashed text-blue-500 text-[14px] p-2 rounded"
                        >
                            + Thêm loại phòng
                        </button>
                        
                        <RoomTypeModal
                            visible={isRoomTypeModalVisible}
                            onCancel={handleCloseModalRoomType}
                            onAddRoomType={handleAddRoomType}
                            onUpdateRoomType={handleUpdateRoomType}
                            editingRoomType={editingRoomType}
                            key={modalKey}
                        />
                    </div>
                    <div>
                        {roomTypes.length > 0 ? (
                            <div className='mt-5'>
                                {roomTypes.map((roomType, index) => (
                                    <div key={index} className='p-4 border rounded mb-4 '>
                                        <div className='flex justify-between items-start'>
                                            <div className='space-y-1 text-[15px]'>
                                                <h3>
                                                    <span className='font-semibold'>Tên loại phòng: </span> 
                                                    {roomType.name}
                                                </h3>
                                                <p>
                                                    <span className='font-semibold'>Diện tích: </span> 
                                                    {roomType.area} m²
                                                </p>
                                                <p>
                                                    <span className='font-semibold'>Tầm nhìn: </span> 
                                                    {roomType.view}
                                                </p>
                                                <div>
                                                    <span className='font-semibold'>Cơ sở vật chất: </span>
                                                    {roomType.roomFacilities?.map((facility, key) => (
                                                        <span key={key} className='p-1 bg-green-100 rounded mr-1'>{facility}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 text-[14px]">
                                                <button
                                                    onClick={() => {
                                                        handleEditRoomType(roomType, index);
                                                    }}
                                                    className="text-blue-500 hover:text-indigo-900"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleRemoveRoomType(index)
                                                    }}
                                                    className="text-red-500 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {roomType.rooms?.length > 0 && (
                                            <div className=''>
                                                <h3 className="font-bold text-[18px] mt-3 mb-1">Danh sách phòng</h3>
                                            </div>
                                        )}
                                        {roomType.rooms?.map((room, roomIndex) => (
                                            <div key={roomIndex} className="relative p-2 rounded my-2 bg-slate-50 border">
                                                <div className='flex justify-between items-start'>
                                                    <div className='space-y-1 text-[15px]'>
                                                        <p>
                                                            <span className='font-semibold'>Loại giường:</span>
                                                            {room.bedType}
                                                        </p>
                                                        <p>
                                                            <span className='font-semibold'>Giá:</span>
                                                            {room.price.toLocaleString()} VNĐ
                                                        </p>
                                                    </div>
                                                    <div className="flex space-x-2 text-[13px]">
                                                        <button
                                                            onClick={() => {
                                                                handleEditRoom(index, roomType, roomIndex, room);
                                                            }}
                                                            className="text-blue-500 hover:text-indigo-900"
                                                        >
                                                            Sửa
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleRemoveRoom(index, roomType, roomIndex)
                                                            }}
                                                            className="text-red-500 hover:text-red-900"
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className='flex justify-end'>
                                            <button
                                                onClick={() => {
                                                    handleOpenRoomModal(roomType ,index)
                                                }}
                                                className="text-sm rounded bg-blue-400 text-white px-2 py-1"
                                            >
                                                + Thêm phòng
                                            </button>
                                            <RoomModal
                                                visible={isRoomModalVisible}
                                                onCancel={handleCloseRoomModal}
                                                onAddRoom={handleAddRoom}
                                                onUpdateRoom={handleUpdateRoom}
                                                editingRoom={editingRoom}
                                                key={modalRoomKey}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="p-2">Cần ít nhất một loại phòng và mỗi loại phòng phải có ít nhất 1 phòng</p>
                        )}
                    </div>
                </div>
                <div className='flex gap-5 justify-start mt-4'>
                    <button
                        onClick={() => setStep(1)}
                        className="text-gray-600 bg-white px-6 py-2 rounded border border-1 border-gray-500"
                    >
                        Quay lại
                    </button>
                    <button
                        form="hotelForm"
                        type='submit'
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Thêm khách sạn
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-softBlue min-h-screen p-4 md:p-8'>
            {contextMessageHolder}
            <div className='w-[80%] mx-auto'>
                {step === 1 && formHotel()}
                {step === 2 && formRoomType()}
            </div>
            
        </div>
    );
}
export default CreateHotel;