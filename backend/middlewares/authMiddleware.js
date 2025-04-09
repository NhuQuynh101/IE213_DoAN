import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Admin from '../models/Admin.js';
import response from '../utils/responseHandler.js';

// Sử dụng biến JWT_SECRET từ .env hoặc dùng giá trị mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'vagabond123';

export const authMiddleware = async (req, res, next) => {
    try {
        // Check token from cookies
        const token = req.cookies.auth_token;
        
        if (!token) {
            return response(res, 401, 'Không có quyền truy cập, vui lòng đăng nhập');
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || !decoded.userId) {
            return response(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
        }
        
        // Check if user exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return response(res, 401, 'Người dùng không tồn tại');
        }
        
        // Attach user info to request
        req.user = {
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

export const verifyAdminToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return response(res, 401, 'Không tìm thấy token xác thực');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if admin exists
        const admin = await Admin.findById(decoded.userId);
        if (!admin) {
            return response(res, 401, 'Token không hợp lệ hoặc admin không tồn tại');
        }

        // Check if admin role
        if (admin.role !== 'admin') {
            return response(res, 403, 'Không có quyền truy cập');
        }

        // Attach admin info to request
        req.admin = {
            userId: admin._id,
            email: admin.email,
            role: admin.role
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

export default authMiddleware; 