import React, { useState } from "react";
import { Modal, Select } from "antd";
const { Option } = Select;


const RoomTypeModal = ({ visible, onCancel, onOk, roomTypeData = {} }) => {
  const [name, setName] = useState(roomTypeData.name || "");
  const [area, setArea] = useState(roomTypeData.area || 0);
  const [view, setView] = useState(roomTypeData.view || "");
  const [facility, setFacility] = useState(roomTypeData.facility || []);
  const [showRoomTypeError, setShowRoomTypeError] = useState(false);

  const handleSelectChange = (value) => {
    setFacility(value);
  };

  const resetForm = () => {
    setName("");
    setArea(0);
    setView("");
    setFacility([]);
    setShowRoomTypeError(false);
  }

  const renderRoomError = () => {
    return <p className="text-red-500">Vui lòng điền đầy đủ thông tin</p>;
  }

  const handleSubmit = () => {

    if (name.trim() === "" || area === 0 || view === "" || facility == null) {
      setShowRoomTypeError(true);
      return;
    }

    const newRoomType = {
      name: name,
      area: area,
      view: view,
      roomFacilities: facility,
    };
    onOk(newRoomType);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  }
  

  const cityOptions = [
    { value: "TP HCM", label: "TP HCM" },
    { value: "Hà Nội", label: "Hà Nội" },
  ];

  return (
    <Modal open={visible} onCancel={handleCancel} onOk={handleSubmit}>
      <p className="text-[18px] font-semibold mb-3">Thêm loại phòng</p>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[16px]">
          Tên loại phòng
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[16px] mr-2">
          Diện tích (m²)
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[16px] mr-2">
          Hướng phòng
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={view}
          onChange={(e) => {
            setView(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>
      <div className="mb-5">
        <label className="text-[16px] mr-2">
          Cơ sở vật chất phòng
          <span className="text-red-500">*</span>
        </label>
        <Select
          value={facility}
          mode="multiple"
          onChange={(value) => handleSelectChange(value)}
          placeholder="Chọn cơ sở vật chất"
          size="large"
          className="w-full border border-gray-300 rounded"
        >
          {cityOptions.map((city) => (
            <Option key={city.value} value={city.value}>
              {city.label}
            </Option>
          ))}
        </Select>
      </div>
      {showRoomTypeError && renderRoomError()}
    </Modal>
  );
};

export default RoomTypeModal;
