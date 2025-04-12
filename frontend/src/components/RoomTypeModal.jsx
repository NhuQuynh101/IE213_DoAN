import React, { useState } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
const { Option } = Select;


const RoomTypeModal = ({
  visible,
  onCancel,
  onAddRoomType,
  onUpdateRoomType,
  editingRoomType,
}) => {

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: editingRoomType || {
      name: "",
      area: "",
      view: "",
      roomFacilities: [],
      rooms: []
    }
  })

  const roomFacilityOptions = [
    { _id: "Không hút thuốc", name: "Không hút thuốc" },
    { _id: "TV", name: "TV" },
    { _id: "Tủ lạnh", name: "Tủ lạnh" },
    { _id: "Quầy bar mini", name: "Quầy bar mini" },
    { _id: "Số điện thoại", name: "Số điện thoại" },
    { _id: "Ban công", name: "Ban công" },
    { _id: "Vòi sen", name: "Vòi sen" },
    { _id: "Dụng cụ vệ sinh cá nhân", name: "Dụng cụ vệ sinh cá nhân" },
    { _id: "Máy sấy tóc", name: "Máy sấy tóc" },
    { _id: "Điều hòa", name: "Điều hòa" },
    { _id: "Bàn ủi & cầu là", name: "Bàn ủi & cầu là" },
    { _id: "Két bảo hiểm", name: "Két bảo hiểm" },
    { _id: "Nước đóng chai miễn phí", name: "Nước đóng chai miễn phí" },
  ];
  const viewOptions = [
    { _id: "Tầm nhìn hướng thành phố", name: "Tầm nhìn hướng thành phố" },
    { _id: "Tầm nhìn hướng biển", name: "Tầm nhìn hướng biển" },
  ];

  const onSubmit = (newRoomType) => {
    if (editingRoomType){
      onUpdateRoomType(newRoomType)
    }
    else {
      onAddRoomType(newRoomType)
    }
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width={"50%"}
      footer={null}
    >
      <p className="text-[18px] font-semibold mb-3">Thêm loại phòng</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label={"Tên loại phòng"}
          name={"name"}
          register={register}
          errors={errors}
          placeholder={"Nhập tên loại phòng"}
          className="mb-3"
          // validationRules = {{required: "Tên là bắt buộc"}}
        />
        <FormInput
          label={"Diện tích (m²)"}
          type="number"
          name={"area"}
          register={register}
          errors={errors}
          placeholder={"Nhập diện tích phòng"}
          className="mb-3"
          // validationRules = {{required: "Diện tích là bắt buộc"}}
        />
        <FormSelect
          label={"Hướng phòng"}
          name={"view"}
          control={control}
          placeholder={"Chọn tầm nhìn"}
          isMultiple={false}
          options={viewOptions}
          errors={errors}
          className="mb-3"
        />
        <FormSelect
          label={"Cơ sở vật chất phòng"}
          name={"roomFacilities"}
          control={control}
          placeholder={"Chọn cơ sở vật chất phòng"}
          isMultiple={true}
          options={roomFacilityOptions}
          errors={errors}
          className="mb-3"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            {editingRoomType ? "Sửa loại phòng" : "Thêm loại phòng" }
            
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomTypeModal;
