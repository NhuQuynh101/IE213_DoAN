import React, { useState, useEffect } from "react";
import { Modal, Select } from "antd";
import FormInput from "./FormInput";
import { useForm, Controller } from "react-hook-form";
import FormSelect from "./FormSelect";
const { Option } = Select;

const Options = [
  { _id: "Bao gồm bữa sáng", name: "Bao gồm bữa sáng" },
  { _id: "Không phục vụ bữa sáng", name: "Không phục vụ bữa sáng" },
];

const refundOptions = [
  { _id: "Không hoàn tiền", name: "Không hoàn tiền" },
  { _id: "Hoàn tiền", name: "Hoàn tiền" },
];

const RoomModal = ({
  visible,
  onCancel,
  onAddRoom,
  onUpdateRoom,
  editingRoom
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
    defaultValues: editingRoom || {
      bedType: "",
      serveBreakfast: "",
      maxOfGuest: "",
      numberOfRoom: "",
      cancellationPolicy: {
        refund: "",
        day: undefined,
        percentBeforeDay: undefined,
        percentAfterDay: undefined,
      },
      price: undefined
    }
  })

  const onSubmit = (newRoom) => {
    if (editingRoom){
      onUpdateRoom(newRoom);
    }
    else{
      onAddRoom(newRoom)
      console.log(newRoom)
    }
  }

  return (
    <Modal
      open={visible}
      width={"50%"}
      footer={null}
      onCancel={onCancel}
    >
      <p className="text-[18px] font-semibold mb-3">Thêm phòng</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label={"Tên phòng"}
          name={"bedType"}
          register={register}
          errors={errors}
          placeholder={"Nhập tên phòng"}
          // validationRules={{required: "Tên phòng là bắt buộc"}}
        />
        
        <FormSelect
          label={"Bữa sáng"}
          name={"serveBreakfast"}
          control={control}
          options={Options}
          placeholder={"Chọn dịch vụ bữa sáng"}
          // validationRules={{required: "Dịch vụ bữa sáng là bắt buộc"}}
          errors={errors}
        />

        <FormInput
          label={"Số khách tối đa"}
          type="number"
          name={"maxOfGuest"}
          register={register}
          errors={errors}
          placeholder={"Nhập số khách tối đa"}
          // validationRules={{required: "Số khách là bắt buộc"}}
        />

        <FormInput
          label={"Số lượng phòng"}
          type="number"
          name={"numberOfRoom"}
          register={register}
          errors={errors}
          placeholder={"Nhập số phòng tối đa"}
          // validationRules={{required: "Số phòng là bắt buộc"}}
        />

        <FormInput
          label={"Giá phòng (VND)"}
          type="number"
          name={"price"}
          register={register}
          errors={errors}
          placeholder={"Nhập giá phòng"}
          // validationRules={{required: "Giá phòng là bắt buộc"}}
        />

        <p className="text-[16px] font-semibold mb-2 mt-5">
          Chính sách huỷ phòng
        </p>

        <div className="mb-3 flex items-center gap-3">
          <FormSelect
            label={"Hoàn tiền"}
            name={"cancellationPolicy.refund"}
            control={control}
            options={refundOptions}
            placeholder={"Lựa chọn hoàn tiền"}
            errors={errors}
            className="flex-1"
          />
        </div>

        <FormInput
          label={"Số ngày trước khi huỷ"}
          type="number"
          name={"cancellationPolicy.day"}
          register={register}
          errors={errors}
          placeholder={"Nhập số ngày"}
        />

        <FormInput
          label={"Phần trăm hoàn trước số ngày đó"}
          type="number"
          name={"cancellationPolicy.percentBeforeDay"}
          register={register}
          errors={errors}
          placeholder={"Nhập số %"}
        />

        <FormInput
          label={"Phần trăm hoàn sau số ngày đó"}
          type="number"
          name={"cancellationPolicy.percentAfterDay"}
          register={register}
          errors={errors}
          placeholder={"Nhập số %"}
        />

        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            {editingRoom ? "Sửa phòng" : "Thêm phòng" }
            
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomModal;
