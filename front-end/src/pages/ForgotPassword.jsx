import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code and new password
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    resetCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email });
      toast.success(response.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.resetCode || !formData.newPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({
        email,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.data && typeof errorData.data === 'object') {
        Object.values(errorData.data).forEach(msg => toast.error(msg));
      } else {
        toast.error(errorData?.message || 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Quên mật khẩu
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {step === 1 
            ? 'Nhập email của bạn để nhận mã xác thực' 
            : 'Nhập mã xác thực và mật khẩu mới'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã xác thực (6 chữ số)
              </label>
              <input
                type="text"
                value={formData.resetCode}
                onChange={(e) => setFormData({ ...formData, resetCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
                pattern="\d{6}"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Kiểm tra email hoặc console log (dev mode) để lấy mã
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Tối thiểu 8 ký tự, có số và ký tự đặc biệt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center mt-6 text-gray-600">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

