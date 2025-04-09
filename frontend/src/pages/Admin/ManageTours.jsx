import { Outlet } from "react-router-dom";

const ManageTours = () => {
    return (
        <>
            <h1>Quản lí tour</h1>
            <Outlet></Outlet>
        </>
    );
};

export default ManageTours;
