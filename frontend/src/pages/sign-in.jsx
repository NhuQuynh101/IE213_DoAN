import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoMdClose } from 'react-icons/io';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Environment } from '../../environments/environments';

const facebookAppId = Environment.FACEBOOK_APP_ID;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập tại đây
    console.log('Login with:', email, password);
    alert('Login success');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    // Xử lý đăng nhập Google tại đây
    alert('Google Login Success');
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    // Xử lý lỗi đăng nhập Google
    alert('Google Login Failed');
  };

  const handleFacebookSuccess = (response) => {
    console.log('Facebook Login Success:', response);
    // Xử lý đăng nhập Facebook tại đây
  };

  return (
    <div className="grid grid-cols-2 min-h-screen bg-cover bg-center" 
         style={{ backgroundImage: "url('/images/login/background.png')" }}>
      <div></div> {/* Cột trái trống */}
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-[700px] relative p-8 mx-auto">
          
         
          
          <h1 className="text-2xl font-bold text-center mb-2">Log in</h1>
          
          <p className="text-center mb-6">
            Don't have an account? <Link to="/sign-up" className="text-[#27B5FC] hover:underline">Sign up</Link>
          </p>
          
          <div className="flex items-center mx-auto justify-center w-2/3 py-2.5 border border-gray-300 rounded-full mb-3">
            <FacebookLogin
              appId={facebookAppId}
              onSuccess={handleFacebookSuccess}
              className="flex items-center justify-center w-full py-2.5 border border-gray-300 rounded-full hover:bg-gray-50"
              render={({ onClick }) => (
                <button onClick={onClick} className="flex items-center justify-center w-full">
                  <FaFacebook className="text-blue-600 mr-2" size={20} />
                  <span>Log in with Facebook</span>
                </button>
              )}
            />
          </div>
          
          <div className="w-2/3 mx-auto mb-6">
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
          
          <div className="flex w-2/3 mx-auto items-center mb-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <div className="mx-4 text-gray-500">OR</div>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          
          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="w-2/3 mx-auto">
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
            
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Your password
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
            
            <div className="text-right mb-6">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:underline">
                Forgot your password
              </Link>
            </div>
            
            <button
              type="submit"
              className="w-full py-2.5 bg-[#27B5FC] text-white rounded-full hover:bg-[#27B5FC]/80 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
