import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ 
  label = "Mật khẩu", 
  name = "password", 
  value, 
  onChange, 
  required = true,
  placeholder = "",
  error = "",
  helpText = "",
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          tabIndex="-1"
        >
          {showPassword ? (
            <FaEyeSlash size={20} className="transition-opacity" />
          ) : (
            <FaEye size={20} className="transition-opacity" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default PasswordInput;

