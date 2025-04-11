import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import response from '../utils/responseHandler.js';

// Sử dụng biến JWT_SECRET từ .env hoặc dùng giá trị mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'vagabond123';

const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Check for token in cookies
        const token = req.cookies.admin_token;
        
        if (!token) {
            return response(res, 401, 'Không có quyền truy cập, vui lòng đăng nhập');
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || !decoded.userId || decoded.role !== 'admin') {
            return response(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
        }
        
        // Check if admin exists
        const admin = await Admin.findById(decoded.userId);
        if (!admin) {
            return response(res, 401, 'Tài khoản admin không tồn tại');
        }
        
        // Attach admin info to request
        req.admin = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return response(res, 401, 'Token không hợp lệ');
        }
        if (error.name === 'TokenExpiredError') {
            return response(res, 401, 'Token đã hết hạn');
        }
        return response(res, 500, 'Lỗi xác thực', error.message);
    }
};

export default adminAuthMiddleware; 