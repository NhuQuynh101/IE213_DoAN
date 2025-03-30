import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log('Google Sign Up Success:', credentialResponse);
        // Xử lý đăng ký Google tại đây
    };

    const handleGoogleError = () => {
        console.log('Google Sign Up Failed');
        // Xử lý lỗi đăng ký Google
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý đăng ký tại đây
        console.log('Register with:', fullName, email, password);
    };

    return (
        <div className="grid grid-cols-2 min-h-screen bg-cover bg-center" 
             style={{ backgroundImage: "url('/images/login/background.png')" }}>
            <div></div> {/* Cột trái trống */}
            <div className="flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] relative p-8 mx-auto">
                    
                    <h1 className="text-2xl font-bold text-center mb-2">Sign up</h1>
                    
                    <p className="text-center mb-6">
                        Already have an account? <Link to="/sign-in" className="text-[#27B5FC] hover:underline">Log in</Link>
                    </p>
                    
                    <button className="flex items-center mx-auto justify-center w-2/3 py-2.5 border border-gray-300 rounded-full mb-3 hover:bg-gray-50">
                        <FaFacebook className="text-blue-600 mr-2" size={20} />
                        <span>Sign up with Facebook</span>
                    </button>
                    
                    <div className="w-2/3 mx-auto mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            size="large"
                            width="100%"
                            text="signup_with"
                            shape="pill"
                            logo_alignment="center"
                        />
                    </div>
                    
                    <div className="flex w-2/3 mx-auto items-center mb-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <div className="mx-4 text-gray-500">OR</div>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>
                    
                    {/* Form đăng ký */}
                    <form onSubmit={handleSubmit} className="w-2/3 mx-auto">
                        <div className="mb-4">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Your email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Create password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 flex items-center"
                                >
                                    {showPassword ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
                                    <span>Hide</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                                </label>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-[#27B5FC] text-white rounded-full hover:bg-[#27B5FC]/80 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Create account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;

