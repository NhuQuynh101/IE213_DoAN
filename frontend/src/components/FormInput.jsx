const FormInput = ({
    label,
    type = "text",
    name,
    register,
    errors,
    validationRules = {},
    variants = "",
}) => {
    return (
        <div className={`${variants}`}>
            <label className="block font-medium mb-2">
                {label}{" "}
                {validationRules.required && (
                    <span className="text-red-500">*</span>
                )}
            </label>
            <input
                type={type}
                {...register(name, validationRules)}
                className={`w-full border p-2 rounded ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                }`}
            ></input>
            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default FormInput;
