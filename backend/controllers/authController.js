// RESTful API for Users
// Xác thực token của người dùng trước khi họ truy cập API
// Được sử dụng trong routes/userRoutes.js để bảo vệ API
import User from '../models/user.js';
import { generateToken } from '../utils/generateToken.js';
import response from '../utils/responseHandler.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


const registerUser = async (req, res) => {
    try {
        const { username, email, password, gender, dateOfBirth, phoneNumber } = req.body;
        
        // Validate required fields
        if (!username || !email || !password || !gender || !dateOfBirth || !phoneNumber) {
            return response(res, 400, 'Vui lòng điền đầy đủ thông tin');
        }
        
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return response(res, 400, 'Email đã tồn tại');
        }
        
        // Check if phone number already exists
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
            return response(res, 400, 'Số điện thoại đã tồn tại');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            gender,
            dateOfBirth,
            phoneNumber,
            profilePicture: null,
            role: "user",
        });
        
        await newUser.save();
        
        // Generate token
        const accessToken = generateToken(newUser);
        
        // Set cookie
        res.cookie("auth_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
        });
        
        return response(res, 201, 'Đăng ký thành công',
            {
                username: newUser.username,
                email: newUser.email
            }
        );
    }
    catch (error) {
        return response(res, 500, 'Đăng ký thất bại', error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email || !password) {
            return response(res, 400, 'Vui lòng cung cấp email và mật khẩu');
        }
        
        // Check email
        const user = await User.findOne({ email });
        if (!user) {
            return response(res, 400, 'Email không tồn tại');
        }
        
        // Check password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return response(res, 400, 'Mật khẩu không chính xác');
        }
        
        // Generate token
        const accessToken = generateToken(user);
        
        // Set cookie
        res.cookie("auth_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
        });
        
        return response(res, 200, 'Đăng nhập thành công',
            {
                username: user.username,
                email: user.email,
                role: user.role,
                token: accessToken
            }
        );
    }
    catch (error) {
        return response(res, 500, 'Đăng nhập thất bại', error.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("auth_token", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "None"
        });
        return response(res, 200, 'Đăng xuất thành công');
    }
    catch (error) {
        return response(res, 500, 'Đăng xuất thất bại', error.message);
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Xóa người dùng
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return response(res, 404, "Người dùng không tồn tại");
        }
        
        return response(res, 200, 'Xóa tài khoản thành công');
    }
    catch (error) {
        return response(res, 500, 'Xóa tài khoản thất bại', error.message);
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!email) {
            return res.status(400).json({ 
                message: 'Vui lòng nhập địa chỉ email' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Địa chỉ email không hợp lệ' 
            });
        }

        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy tài khoản với email này' 
            });
        }

        // Generate reset token and hash it
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Create reset URL with original token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        try {
            // Configure email transporter
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                },
                debug: true // Enable debug logs
            });

            // Verify transporter configuration
            await transporter.verify();

            // Create email content
            const mailOptions = {
                from: {
                    name: 'Password Reset',
                    address: process.env.EMAIL_USERNAME
                },
                to: user.email,
                subject: 'Đặt lại mật khẩu',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2>Yêu cầu đặt lại mật khẩu</h2>
                        <p>Xin chào,</p>
                        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
                        <div style="margin: 20px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #4CAF50; 
                                      color: white; 
                                      padding: 12px 24px; 
                                      text-decoration: none; 
                                      border-radius: 4px;
                                      display: inline-block;">
                                Đặt lại mật khẩu
                            </a>
                        </div>
                        <p>Link này sẽ hết hạn sau 1 giờ.</p>
                        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                        <hr>
                        <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                `
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ', info.response);

            res.status(200).json({ 
                message: 'Email đặt lại mật khẩu đã được gửi',
                info: 'Vui lòng kiểm tra email của bạn và làm theo hướng dẫn'
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            
            // Reset the user's token since email failed
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.status(500).json({ 
                message: 'Không thể gửi email đặt lại mật khẩu',
                error: emailError.message
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the token from request to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
    }
};

export { registerUser, loginUser, logoutUser, deleteAccount, forgotPassword, resetPassword };


