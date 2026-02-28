import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-gray-400 mb-4">
              Cung cấp các sản phẩm điện tử chất lượng với giá tốt nhất. Uy tín - Chất lượng - Giá rẻ.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Liên hệ</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-3 hover:text-white transition-colors">
                <FaEnvelope className="mt-1 text-yellow-400" />
                <div>
                  <span className="block text-sm text-gray-500">Email</span>
                  <a href="mailto:contact@computershop.com" className="hover:text-yellow-400">contact@computershop.com</a>
                </div>
              </li>
              <li className="flex items-start space-x-3 hover:text-white transition-colors">
                <FaPhone className="mt-1 text-yellow-400" />
                <div>
                  <span className="block text-sm text-gray-500">Hotline</span>
                  <a href="tel:0123456789" className="hover:text-yellow-400">0123 456 789</a>
                </div>
              </li>
              <li className="flex items-start space-x-3 hover:text-white transition-colors">
                <FaMapMarkerAlt className="mt-1 text-yellow-400" />
                <div>
                  <span className="block text-sm text-gray-500">Địa chỉ</span>
                  <span>123 Đường ABC, TP.HCM</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Đơn hàng của tôi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Policies */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Chính sách</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors inline-flex items-center">
                  <span className="mr-2">→</span> Hướng dẫn thanh toán
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>
              &copy; 2025 <span className="text-yellow-400 font-semibold">Computer Shop</span>. 
              <span className="ml-1">Tất cả quyền được bảo lưu.</span>
            </p>
            <p className="mt-2 md:mt-0">
              Được phát triển với <span className="text-red-500">❤</span> bởi Computer Shop Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

