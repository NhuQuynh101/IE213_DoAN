import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProjectedRoute";
import AdminLayout from "../pages/Admin/AdminLayout";
import ManageTours from "../pages/Admin/ManageTours";
import CreateTour from "../pages/Admin/CreateTour";
import ManageHotels from "../pages/Admin/ManageHotels";
import CreateHotel from "../pages/Admin/CreateHotel";

const AdminRoutes = ({ isAdmin }) => {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute
                        isAllowed={isAdmin}
                        redirectTo="/sign-in"
                    ></ProtectedRoute>
                }
            >
                <Route element={<AdminLayout></AdminLayout>}>
                    <Route path="admin/manage-tours">
                        <Route
                            index
                            element={<ManageTours></ManageTours>}
                        ></Route>
                        <Route
                            path="create-tour"
                            element={<CreateTour></CreateTour>}
                        ></Route>
                    </Route>

                    <Route path="admin/manage-hotels">
                        <Route
                            index
                            element={<ManageHotels></ManageHotels>}
                        ></Route>
                        <Route
                            path="create-hotel"
                            element={<CreateHotel></CreateHotel>}
                        ></Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
