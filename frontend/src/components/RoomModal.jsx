import React, { useState, useEffect } from "react";
import { Modal, Select } from "antd";
const { Option } = Select;

const RoomModal = ({ visible, onCancel, onOk, roomData = {} }) => {
  const [bedType, setBedType] = useState(roomData.bedType || "");
  const [serveBreakfast, setServeBreakfast] = useState(roomData.serveBreakfast || "");
  const [maxOfGuest, setMaxOfGuest] = useState(roomData.maxOfGuest || 0);
  const [numberOfRoom, setNumberOfRoom] = useState(roomData.numberOfRoom || 0);
  const [price, setPrice] = useState(roomData.price || 0);
  const [cancellationPolicy, setCancellationPolicy] = useState(roomData.cancellationPolicy || {
    refund: "",
    day: "",
    percentBeforeDay: "",
    percentAfterDay: ""
  });
  const [showRoomError, setShowRoomError] = useState(false);

  const resetForm = () => {
    setBedType("");
    setServeBreakfast("");
    setMaxOfGuest(0);
    setNumberOfRoom(0);
    setPrice(0);
    setCancellationPolicy({
      refund: "",
      day: "",
      percentBeforeDay: "",
      percentAfterDay: ""
    });
    setShowRoomError(false);
  };

  const renderRoomError = () => {
    if (bedType.trim() === "" || maxOfGuest === 0 || price === 0 || numberOfRoom === 0) {
      return <p className="text-red-500">Vui lòng điền đầy đủ thông tin</p>;
    }
  }

  const handleSubmit = () => {
    
    if (bedType.trim() === "" || maxOfGuest === 0 || numberOfRoom === 0 || price === 0) {
      setShowRoomError(true);
      return;
    }
    
    const newRoom = {
      bedType: bedType,
      serveBreakfast: serveBreakfast,
      maxOfGuest: maxOfGuest,
      numberOfRoom: numberOfRoom,
      price: price,
      cancellationPolicy: {
        refund: cancellationPolicy.refund,
        day: cancellationPolicy.day,
        percentBeforeDay: cancellationPolicy.percentBeforeDay,
        percentAfterDay: cancellationPolicy.percentAfterDay,
      },
    };
    onOk(newRoom);
    resetForm();
  }

  const handleCancel = () => {
    resetForm();
    onCancel();
  }

  return (
    <Modal open={visible} onCancel={handleCancel} onOk={handleSubmit}>
      <p className="text-[18px] font-semibold mb-3">Thêm phòng</p>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Tên phòng
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={bedType}
          onChange={(e) => {
            setBedType(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>
      <div className="mb-3 flex items-center gap-3">
        <label className="min-w-fit">Bữa sáng</label>
        <div className="border rounded border-gray-300 w-full ml-2">
          <Select
            value={serveBreakfast}
            onChange={(value) => setServeBreakfast(value)}
            placeholder="Chọn"
            size="medium"
            style={{ width: "100%" }} // tuỳ bạn set chiều rộng ở đây
          >
            <Option value="Không phục vụ bữa sáng">
              Không phục vụ bữa sáng
            </Option>
            <Option value="Bao gồm bữa sáng">Bao gồm bữa sáng</Option>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Số khách tối đa
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={maxOfGuest}
          onChange={(e) => {
            setMaxOfGuest(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px] ml-2"
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Số lượng phòng
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={numberOfRoom}
          onChange={(e) => {
            setNumberOfRoom(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px] ml-2"
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Giá phòng (VND)
          <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>

      <p className="text-[16px] font-semibold mb-2 mt-5">
        Chính sách huỷ phòng
      </p>

      <div className="mb-3 flex items-center gap-3">
        <label className="min-w-fit">Hoàn tiền</label>
        <div className="border rounded border-gray-300 w-full ml-2">
          <Select
            value={cancellationPolicy.refund}
            onChange={(value) =>
              setCancellationPolicy({ ...cancellationPolicy, refund: value })
            }
            placeholder="Chọn"
            size="medium"
            style={{ width: "100%" }}
          >
            <Option value="Có hoàn tiền">Có hoàn tiền</Option>
            <Option value="Không hoàn tiền">Không hoàn tiền</Option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Số ngày trước khi huỷ
        </label>
        <input
          type="number"
          value={cancellationPolicy.day || ""}
          onChange={(e) =>
            setCancellationPolicy({
              ...cancellationPolicy,
              day: e.target.value,
            })
          }
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Phần trăm hoàn trước số ngày đó
        </label>
        <input
          type="number"
          value={cancellationPolicy.percentBeforeDay || ""}
          onChange={(e) =>
            setCancellationPolicy({
              ...cancellationPolicy,
              percentBeforeDay: e.target.value,
            })
          }
          className="flex-1 border border-gray-300 rounded p-[5px]"
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <label className="text-[14px]">
          Phần trăm hoàn sau số ngày đó
        </label>
        <input
          type="number"
          value={cancellationPolicy.percentAfterDay || ""}
          onChange={(e) =>
            setCancellationPolicy({
              ...cancellationPolicy,
              percentAfterDay: e.target.value,
            })
          }
          className="flex-1 border border-gray-300 rounded p-[5px] ml-3"
        />
      </div>
      {showRoomError && (
        <div className="mt-3">
          {renderRoomError()}
        </div>
      )}
    </Modal>
  );
};

export default RoomModal;
