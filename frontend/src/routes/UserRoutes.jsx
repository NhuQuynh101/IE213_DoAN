import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProjectedRoute";

const UserRoutes = ({ isAuthenticated }) => {
    return (
        <Routes>
            <Route
                element={
                    <ProtectedRoute
                        isAllowed={isAuthenticated}
                        redirectTo="/sign-in"
                    ></ProtectedRoute>
                }
            >
                <Route></Route>
                <Route></Route>
            </Route>
        </Routes>
    );
};
export default UserRoutes;
