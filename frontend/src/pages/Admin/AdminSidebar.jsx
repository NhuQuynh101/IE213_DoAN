import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FaMoneyBillWave,
    FaHotel,
    FaUmbrellaBeach,
    FaUser,
} from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TbDeviceAnalytics } from "react-icons/tb";
const AdminSidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const MENU_ITEMS = [
        {
            title: "Dashboard",
            to: "/admin/dashboard",
            icon: <TbDeviceAnalytics className="text-lg"></TbDeviceAnalytics>,
        },
        {
            title: "Booking",
            to: "/admin/booking",
            icon: <FaMoneyBillWave className="text-lg"></FaMoneyBillWave>,
        },
        {
            title: "Tour",
            to: "/admin/manage-tours",
            icon: <FaUmbrellaBeach className="text-lg"></FaUmbrellaBeach>,
        },
        {
            title: "Khách sạn",
            to: "/admin/manage-hotels",
            icon: <FaHotel className="text-lg"></FaHotel>,
        },
    ];

    return (
        <div
            className={`h-screen relative text-[#1a202e] transition-all duration-300 ${
                isCollapsed ? "w-16" : "w-64"
            }`}
        >
            <div className="py-4 flex items-center justify-center">
                {!isCollapsed && <h1>Vagabond</h1>}
            </div>
            {!isCollapsed && (
                <div className="flex flex-col items-center justify-center py-4">
                    <FaUser className="w-10 h-10"></FaUser>
                    <div className="mt-2 text-center">
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-gray-500">admin@gmail.com</p>
                    </div>
                </div>
            )}
            <button
                className="text-xl p-1 border rounded-full absolute right-0 top-0 translate-x-[50%] bg-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <MdKeyboardArrowRight />
                ) : (
                    <MdKeyboardArrowLeft />
                )}
            </button>

            <nav className="mt-5">
                <ul className="space-y-1">
                    {MENU_ITEMS.map((item, index) => (
                        <li
                            key={index}
                            className="px-1"
                        >
                            <Link
                                to={item.to}
                                className={`flex gap-3 items-center h-12 px-4 hover:bg-[#f2f2fc] rounded-lg ${
                                    location.pathname === item.to
                                        ? "bg-[#f2f2fc]"
                                        : ""
                                }`}
                            >
                                <div className="w-5 h-5 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="text-nowrap">
                                        {item.title}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default AdminSidebar;
