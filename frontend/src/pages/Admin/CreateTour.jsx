import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCreateTourMutation } from "../../redux/api/tourApiSlice";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import TextEditor from "./TextEditor";
import { HiPlus } from "react-icons/hi";
import { Modal } from "antd";
import TicketForm from "../../components/TicketForm";
const CreateTour = () => {
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

    const tourCategories = [
        {
            tag: "100",
            title: "Tour dưới nước",
        },
        {
            tag: "101",
            title: "Tour trên đất liền",
        },
        {
            tag: "102",
            title: "Tour ẩm thực",
        },
        {
            tag: "103",
            title: "Tour theo chủ đề",
        },
    ];

    const languageOptions = [
        {
            tag: "200",
            title: "Tiếng Việt",
        },
        {
            tag: "201",
            title: "Tiếng Anh",
        },
        {
            tag: "202",
            title: "Tiếng Trung",
        },
        {
            tag: "203",
            title: "Tiếng Hàn",
        },
        {
            tag: "204",
            title: "Tiếng Nhật",
        },
    ];
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
    } = useForm();

    const [step, setStep] = useState(1);

    const [createTour] = useCreateTourMutation();

    const onSubmitTour = (data) => {
        setStep(2);
    };

    const [isTicketModalOpen, setisTicketModalOpen] = useState(false);

    const showModal = () => {
        setEditingIndex(null);
        setEditingTicket(null);
        setisTicketModalOpen(true);
        setFormKey((prev) => prev + 1);
    };
    const handleCancel = () => {
        setisTicketModalOpen(false);
    };

    const [tickets, setTickets] = useState([]);
    const [editingTicket, setEditingTicket] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const handleAddTicket = (ticket) => {
        setTickets([...tickets, ticket]);
    };

    const handleUpdateTicket = (updatedTicket) => {
        const updatedTickets = [...tickets];
        updatedTickets[editingIndex] = updatedTicket;
        setTickets(updatedTickets);
    };

    const handleEditTicket = (ticket, index) => {
        setEditingTicket(ticket);
        setEditingIndex(index);
        setFormKey((prev) => prev + 1);
        setisTicketModalOpen(true);
    };

    const handleDeleteTicket = (index) => {
        const newTickets = [...tickets];
        newTickets.slice(index, 1);
        setTickets(newTickets);

        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingTicket(null);
        } else if (editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleCancelEdit = () => {
        setEditingTicket(null);
        setEditingIndex(null);
    };

    const finishTour = () => {};

    const renderStep1 = () => {
        return (
            <div>
                <h2 className="font-semibold text-2xl">Thêm thông tin tour</h2>
                <form onSubmit={handleSubmit(onSubmitTour)}>
                    <div className="bg-white rounded-lg shadow-md mt-6">
                        <h2 className="font-semibold text-lg px-6 py-4 border-b">
                            Thông tin tour
                        </h2>
                        <div className="space-y-4 p-6 overflow-auto">
                            <FormInput
                                label={"Tên tour"}
                                name={"name"}
                                register={register}
                                errors={errors}
                                // validationRules={{
                                //     required: "Tên là bắt buộc",
                                // }}
                                placeholder={"Tên tour"}
                            ></FormInput>

                            <FormInput
                                label={"Địa điểm"}
                                name={"location"}
                                placeholder={"Địa điểm"}
                                register={register}
                                errors={errors}
                                // validationRules={{
                                //     required: "Địa điểm là bắt buộc",
                                // }}
                            ></FormInput>
                            <FormSelect
                                label={"Loại tour"}
                                name={"category"}
                                placeholder={"Chọn loại tour"}
                                // validationRules={{
                                //     required: "Loại tour là bắt buộc",
                                // }}
                                options={tourCategories}
                                errors={errors}
                                control={control}
                                isMultiple={true}
                                valueField="tag"
                                labelField="title"
                            ></FormSelect>

                            <div className="flex gap-2">
                                <FormSelect
                                    label={"Thành phố"}
                                    name={"city"}
                                    control={control}
                                    placeholder={"Chọn thành phố"}
                                    // validationRules={{
                                    //     required: "Thành phố là bắt buộc",
                                    // }}
                                    options={cityOptions}
                                    className="flex-1"
                                    errors={errors}
                                ></FormSelect>
                                <FormInput
                                    label={"Thời lượng tour"}
                                    name={"duration"}
                                    register={register}
                                    errors={errors}
                                    placeholder={"Nhập thời lượng tour"}
                                    // validationRules={{
                                    //     required: "Thời lượng tour là bắt buộc",
                                    // }}
                                    className="flex-1"
                                ></FormInput>
                            </div>
                            <TextEditor
                                label={"Trải nghiệm"}
                                name="experiences"
                                placeholder="Nhập các trải nghiệm của tour..."
                                // validationRules={{
                                //     required: "Trải nghiệm tour là bắt buộc",
                                // }}
                                control={control}
                                errors={errors}
                            ></TextEditor>
                            <FormSelect
                                label={"Dịch vụ ngôn ngữ"}
                                name={"languageService"}
                                placeholder={"Chọn dịch vụ ngôn ngữ có sẵn"}
                                // validationRules={{
                                //     required: "Dịch vụ ngôn ngữ là bắt buộc",
                                // }}
                                options={languageOptions}
                                errors={errors}
                                control={control}
                                isMultiple={true}
                                valueField="tag"
                                labelField="title"
                            ></FormSelect>
                            <div className="flex gap-2">
                                <FormInput
                                    label={"Phù hợp với"}
                                    name={"suitableFor"}
                                    placeholder={"Phù hợp với"}
                                    register={register}
                                    errors={errors}
                                    className="flex-1"
                                ></FormInput>
                                <FormInput
                                    label={"Liên hệ đối tác"}
                                    name={"contact"}
                                    placeholder={"Nhập số điện thoại"}
                                    register={register}
                                    errors={errors}
                                    className="flex-1"
                                ></FormInput>
                            </div>
                            <TextEditor
                                label={"Lịch trình"}
                                name="itinerary"
                                placeholder="Nhập lịch trình của tour..."
                                // validationRules={{
                                //     required: "Lịch trình tour là bắt buộc",
                                // }}
                                control={control}
                                errors={errors}
                            ></TextEditor>
                        </div>
                    </div>
                    <button className="flex items-center p-2 text-white bg-blue-500 gap-2 rounded mt-6">
                        Tiếp tục thêm vé
                    </button>
                </form>
            </div>
        );
    };

    const renderStep2 = () => (
        <div className="">
            <div className="bg-white rounded-lg shadow-md mt-4">
                <div className="flex items-baseline justify-between px-6 py-4 border-b">
                    <h2 className="font-semibold text-lg text-">
                        Thông tin vé
                    </h2>
                    <button
                        onClick={showModal}
                        className="flex items-center p-2 text-white bg-blue-500 gap-2 rounded"
                    >
                        <HiPlus></HiPlus>
                        Thêm vé
                    </button>
                    <Modal
                        title="Thêm thông tin vé"
                        open={isTicketModalOpen}
                        onCancel={handleCancel}
                        width={"60%"}
                        footer={null}
                        key={formKey}
                        destroyOnClose
                    >
                        <TicketForm
                            onAddTicket={(ticket) => {
                                handleAddTicket(ticket);
                                handleCancel();
                            }}
                            onUpdateTicket={(ticket) => {
                                handleUpdateTicket(ticket);
                                handleCancel();
                            }}
                            editingTicket={editingTicket}
                            onCancelEdit={() => {
                                handleCancelEdit();
                                handleCancel();
                            }}
                        />
                    </Modal>
                </div>
                <div className="p-6">
                    {tickets.length > 0 ? (
                        <div className="space-y-6">
                            {tickets.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 shadow-sm"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                {ticket.title}
                                            </h3>
                                            {ticket.subtitle && (
                                                <p className="text-gray-600">
                                                    {ticket.subtitle}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleEditTicket(
                                                        ticket,
                                                        index
                                                    )
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteTicket(index)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    {ticket.description && (
                                        <p className="mt-2 text-gray-700">
                                            {ticket.description}
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <div className="mt-2 space-y-2">
                                            <div className="pl-4 border-l-2 border-indigo-200">
                                                <p>
                                                    <span className="font-medium">
                                                        {
                                                            ticket.prices[0]
                                                                .priceType
                                                        }
                                                        :
                                                    </span>{" "}
                                                    {ticket.prices[0].price.toLocaleString()}{" "}
                                                    VND
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Cần ít nhất một vé để tạo tour. Vui lòng thêm vé</p>
                    )}
                </div>
            </div>
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 bg-white px-6 py-2 rounded border border-1 border-gray-500"
                >
                    Quay lại
                </button>
                <button
                    onClick={() => {
                        if (tickets.length === 0)
                            return alert("Phải có ít nhất 1 vé");
                        setStep(3);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Hoàn tất & xem lại
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => {
        const tourData = watch();
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Xác nhận và gửi</h2>
                <p>
                    <strong>Tên tour:</strong> {tourData.name}
                </p>
                <p>
                    <strong>Địa điểm:</strong> {tourData.location}
                </p>
                <p>
                    <strong>Số vé:</strong> {tickets.length}
                </p>

                <button
                    onClick={finishTour}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Gửi Tour
                </button>
                <button
                    onClick={() => setStep(2)}
                    className="text-gray-600 underline"
                >
                    Quay lại
                </button>
            </div>
        );
    };

    const onSubmit = () => {};
    return (
        <div className="bg-softBlue min-h-screen">
            <div className="w-[80%] mx-auto py-6">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default CreateTour;
