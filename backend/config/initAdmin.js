import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const initializeAdmin = async () => {
    try {
        // Kiểm tra xem đã có admin nào chưa
        const adminExists = await Admin.findOne({ role: 'admin' });
        
        if (!adminExists) {
            const defaultPassword = 'admin123456';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultPassword, salt);
            
            // Tạo admin mặc định
            const defaultAdmin = new Admin({
                username: 'Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                firstName: 'Quynh',
                lastName: 'Ngo',
                phone: '0123456789',
                nationality: 'Việt Nam',
                city: 'Hà Nội',
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            // Lưu vào database
            await defaultAdmin.save();
            
            console.log('=================================');
            console.log('Tài khoản Admin mặc định đã được tạo:');
            console.log('Email: admin@gmail.com');
            console.log('Mật khẩu: admin123456');
            console.log('=================================');
        }
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản admin:', error);
    }
};

export default initializeAdmin; 