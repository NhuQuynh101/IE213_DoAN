import { useForm } from "react-hook-form";
import { useCreateTourMutation } from "../../redux/api/tourApiSlice";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
const CreateTour = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [createTour] = useCreateTourMutation();
    const onSubmit = () => {};
    return (
        <div className="w-[60%] mx-auto p-5 border rounded-lg shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    label={"Tên tour"}
                    name={"name"}
                    register={register}
                    errors={errors}
                    validationRules={{ required: "Tên là bắt buộc" }}
                ></FormInput>

                <FormInput
                    label={"Địa điểm"}
                    name={"location"}
                    register={register}
                    errors={errors}
                    validationRules={{ required: "Địa điểm là bắt buộc" }}
                ></FormInput>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Thêm Tour
                </button>
            </form>
        </div>
    );
};

export default CreateTour;
