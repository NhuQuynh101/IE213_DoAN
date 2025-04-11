import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import response from '../utils/responseHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'vagabond123';

const generateAdminToken = (admin) => {
    return jwt.sign(
        {
            userId: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return response(res, 400, 'Vui lòng cung cấp email và mật khẩu');
        }
        
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return response(res, 400, 'Email không tồn tại');
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return response(res, 400, 'Mật khẩu không chính xác');
        }
        
        const token = generateAdminToken(admin);
        
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        return response(res, 200, 'Đăng nhập thành công', {
            username: admin.username,
            email: admin.email,
            role: admin.role,
            token: token
        });
    } catch (error) {
        return response(res, 500, 'Đăng nhập thất bại', error.message);
    }
};

const logoutAdmin = async (req, res) => {
    try {
        res.cookie('admin_token', '', {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        });
        
        return response(res, 200, 'Đăng xuất thành công');
    } catch (error) {
        return response(res, 500, 'Đăng xuất thất bại', error.message);
    }
};

export { loginAdmin, logoutAdmin, generateAdminToken }; 