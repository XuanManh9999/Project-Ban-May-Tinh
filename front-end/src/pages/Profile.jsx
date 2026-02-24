import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import PasswordInput from '../components/PasswordInput';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data.data;
      setProfile(userData);
      setFormData({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (formData.phone && !/^(\+84|0)[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải chứa chữ cái, số và ký tự đặc biệt';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data.data);
      setEditMode(false);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật thông tin';
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      await userAPI.changePassword(passwordData);
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Không thể đổi mật khẩu';
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || '',
      address: profile.address || '',
    });
    setErrors({});
  };

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Thông tin cá nhân</h1>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Thông tin tài khoản</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaEdit />
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={profile?.username || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  !editMode ? 'bg-gray-50' : 'bg-white'
                } ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-4 py-2 border rounded-lg ${
                  !editMode ? 'bg-gray-50' : 'bg-white'
                } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Nhập số điện thoại"
                className={`w-full px-4 py-2 border rounded-lg ${
                  !editMode ? 'bg-gray-50' : 'bg-white'
                } ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Nhập địa chỉ"
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg ${
                  !editMode ? 'bg-gray-50' : 'bg-white'
                } ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Action Buttons */}
            {editMode && (
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaSave />
                  <span>Lưu thay đổi</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FaTimes />
                  <span>Hủy</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <FaLock className="inline mr-2" />
              Đổi mật khẩu
            </h2>
            {!showChangePassword && (
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Đổi mật khẩu
              </button>
            )}
          </div>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <PasswordInput
                label="Mật khẩu hiện tại"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                required
              />

              <PasswordInput
                label="Mật khẩu mới"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                helpText="Tối thiểu 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt"
                required
              />

              <PasswordInput
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                required
              />

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaSave />
                  <span>Lưu mật khẩu</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <FaTimes />
                  <span>Hủy</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-lg p-4 mt-6">
          <p className="text-sm text-gray-600">
            <strong>Vai trò:</strong> {profile?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Ngày tạo tài khoản:</strong>{' '}
            {profile?.createdAt && new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

