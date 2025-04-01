import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProjectedRoute";
import AdminLayout from "../pages/Admin/AdminLayout";
import ManageTours from "../pages/Admin/ManageTours";
import CreateTour from "../pages/Admin/CreateTour";

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
                    <Route
                        path="admin/manage-tours"
                        element={<ManageTours></ManageTours>}
                    >
                        <Route
                            path="create-tour"
                            element={<CreateTour></CreateTour>}
                        ></Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
