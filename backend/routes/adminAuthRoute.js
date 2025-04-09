import express from "express";
const router = express.Router();
import { loginAdmin, logoutAdmin } from "../controllers/adminAuthController.js";
import { updateAdminPassword } from "../controllers/adminUpdatePassword.js";
import { authMiddleware, verifyAdminToken } from "../middlewares/authMiddleware.js";

// Đăng nhập admin
router.post("/login", loginAdmin);

// Đăng xuất admin
router.post("/logout", logoutAdmin);

// Cập nhật mật khẩu admin
router.put("/update-password", verifyAdminToken, updateAdminPassword);

export default router;