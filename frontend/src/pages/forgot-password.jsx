import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi yêu cầu đặt lại mật khẩu
        console.log('Reset password for:', email);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log('Google Login Success:', credentialResponse);
        // Xử lý đăng nhập Google tại đây
    };

    const handleGoogleError = () => {
        console.log('Google Login Failed');
        // Xử lý lỗi đăng nhập Google
    };

    return (
        <div className="grid grid-cols-2 h-screen bg-cover bg-center" 
             style={{ backgroundImage: "url('/images/login/background.png')" }}>
            <div></div> {/* Cột trái trống */}
            <div className="flex items-stretch h-full">
                <div className="bg-white w-full rounded-lg shadow-xl max-w-[700px] flex flex-col justify-center p-8 mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
                    
                    <p className="text-center text-gray-600 mb-4">
                        Enter your email and we'll send you a link to reset your password
                    </p>
                    
                    <p className="text-center mb-6">
                        Remember your password? <Link to="/sign-in" className="text-[#27B5FC] hover:underline">Log in</Link>
                    </p>
                    
                    {/* Form quên mật khẩu */}
                    <form onSubmit={handleSubmit} className="w-2/3 h-full mx-auto">
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Your email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-[#27B5FC] text-white rounded-full hover:bg-[#27B5FC]/80 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-6"
                        >
                            Reset Password
                        </button>
                    </form>
                    
                    {/* Phần chia OR */}
                    <div className="flex w-2/3 mx-auto items-center mb-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="mx-4 text-gray-500">OR</div>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>
                    
                    {/* Đăng nhập với mạng xã hội */}
                    <button className="flex items-center mx-auto justify-center w-2/3 py-2.5 border border-gray-300 rounded-full mb-3 hover:bg-gray-50">
                        <FaFacebook className="text-blue-600 mr-2" size={20} />
                        <span>Log in with Facebook</span>
                    </button>
                    
                    {/* Thay thế nút Google cũ bằng GoogleLogin component */}
                    <div className="w-2/3 mx-auto mb-3">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            size="large"
                            width="100%"
                            text="signin_with"
                            shape="pill"
                            logo_alignment="center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

