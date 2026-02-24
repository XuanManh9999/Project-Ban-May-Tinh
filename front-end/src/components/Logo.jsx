import React from "react";
import { Link } from "react-router-dom";
import { FaStore } from "react-icons/fa";

const Logo = ({ variant = "light" }) => {
  const textColor = variant === "light" ? "text-white" : "text-gray-800";

  return (
    <Link to="/" className="flex items-center space-x-3 group">
      <div className="relative">
        {/* Icon background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>

        {/* Icon */}
        <div className="relative bg-white rounded-lg p-2 shadow-lg">
          <FaStore className="text-2xl text-primary-600" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span
          className={`text-2xl font-bold ${textColor} group-hover:text-yellow-300 transition-colors duration-300`}>
          Computer Shop
        </span>
        <span
          className={`text-xs ${
            variant === "light" ? "text-primary-200" : "text-gray-500"
          } tracking-wider`}>
          MÁY TÍNH & CÔNG NGHỆ
        </span>
      </div>
    </Link>
  );
};

export default Logo;
