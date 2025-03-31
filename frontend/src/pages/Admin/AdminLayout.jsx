import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-5">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
