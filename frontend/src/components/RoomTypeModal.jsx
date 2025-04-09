import React, { useState } from "react";
import { Modal, Select } from "antd";
import RoomModal from '../components/RoomModal';
const { Option } = Select;


const RoomTypeModal = ({ visible, onCancel, onOk, setValue, getValues }) => {
  const [name, setName] = useState("");
  const [area, setArea] = useState(0);
  const [view, setView] = useState("");
  const [facility, setFacility] = useState();
  const [rooms, setRooms] = useState([]);
  const [showRoomTypeError, setShowRoomTypeError] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);

  const handleSelectChange = (value) => {
    setFacility(value);
  };

  const handleRoomModalSubmit = (newRoom) => {
    const prevRooms = rooms || [];
    setRooms([...prevRooms, newRoom]);
    setIsRoomModalVisible(false);
  }

  const resetForm = () => {
    setName("");
    setArea(0);
    setView("");
    setFacility([]);
    setRooms([]);
    setShowRoomTypeError(false);
  }

  const renderRoomError = () => {
    if (name.trim() === "" || area === 0 || view === "" || facility == null) {
      return <p className="text-red-500">Vui lòng điền đầy đủ thông tin</p>;
    }
    if (rooms.length === 0) {
      return <p className="text-red-500">Vui lòng thêm ít nhất một phòng</p>;
    }
  }

  const handleSubmit = () => {

    if (rooms.length === 0) {
      setShowRoomTypeError(true);
      return;
    }

    const newRoomType = {
      name: name,
      area: area,
      view: view,
      roomFacilities: facility,
      rooms: rooms,
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

      <div>
        {rooms.length > 0 && <h3 className="font-semibold text-[16px] mb-3">Danh sách phòng</h3>}
        {rooms.map((room, index) => (
          <div key={index} className="p-4 border rounded mb-4 space-y-1">
            <p className="">Loại giường: {room.bedType}</p>
            <p className="">Bữa sáng: {room.serveBreakfast}</p>
            <p className="">Số khách tối đa: {room.maxOfGuest}</p>
            <p className="">Giá phòng: {room.price}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {setIsRoomModalVisible(true)}}
        className="border-[1.5px] border-blue-500 border-dashed text-blue-500 font-medium text-[14px] p-[5px] rounded mb-5"
      >
        + Thêm phòng
      </button>

      <RoomModal
        visible={isRoomModalVisible}
        onCancel={() => setIsRoomModalVisible(false)}
        onOk={handleRoomModalSubmit}
      />
      {showRoomTypeError && renderRoomError()}
    </Modal>
  );
};

export default RoomTypeModal;
