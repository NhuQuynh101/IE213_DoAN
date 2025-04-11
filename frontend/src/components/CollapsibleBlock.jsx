import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdKeyboardArrowUp } from "react-icons/md";

const CollapsibleBlock = ({ title, children, className }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex flex-col">
            <div
                className={`flex justify-between items-center ${className} cursor-pointer border-b`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="font-semibold text-lg">{title}</h2>
                <span className="text-gray-500">
                    {isOpen ? (
                        <MdKeyboardArrowDown></MdKeyboardArrowDown>
                    ) : (
                        <MdKeyboardArrowRight></MdKeyboardArrowRight>
                    )}
                </span>
            </div>
            <div
                className={`transition-all duration-300 overflow-auto ${
                    isOpen ? "max-h-[999px]" : "max-h-0"
                }`}
            >
                {children}
            </div>
        </div>
    );
};

export default CollapsibleBlock;
