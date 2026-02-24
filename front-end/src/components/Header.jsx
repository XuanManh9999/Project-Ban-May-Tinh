import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaChevronDown, FaList, FaUserCircle, FaShoppingBag, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categoryAPI } from '../services/api';
import Logo from './Logo';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Logo variant="light" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300 transition-colors duration-300 font-medium">
              Trang chủ
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center space-x-1 hover:text-yellow-300 transition-colors duration-300 font-medium focus:outline-none"
              >
                <FaList className="text-sm" />
                <span>Danh mục</span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 z-50 animate-fadeIn">
                  <Link
                    to="/products"
                    onClick={() => setCategoriesOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-primary-600 transition-all font-medium"
                  >
                    <FaList className="inline mr-2" />
                    Tất cả sản phẩm
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-primary-600 transition-all"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/products" className="hover:text-yellow-300 transition-colors duration-300 font-medium">
              Sản phẩm
            </Link>
            
            {isAdmin() && (
              <Link to="/admin" className="hover:text-yellow-300 transition-colors duration-300 font-medium">
                Quản trị
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className="relative hover:text-yellow-300 transition-colors duration-300 p-2"
                  title="Giỏ hàng"
                >
                  <FaShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                
                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none"
                  >
                    <FaUser />
                    <span className="font-medium">{user?.fullName}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-2 z-50 animate-fadeIn">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-primary-600 transition-all"
                      >
                        <FaUserCircle className="inline mr-2" />
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-primary-600 transition-all"
                      >
                        <FaShoppingBag className="inline mr-2" />
                        Đơn hàng của tôi
                      </Link>
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-primary-600 transition-all"
                        >
                          <FaCog className="inline mr-2" />
                          Quản trị
                        </Link>
                      )}
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-all"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 hover:bg-white/10 rounded-full transition-all duration-300 font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              
              {/* Mobile Categories */}
              <div>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <FaList />
                    <span>Danh mục</span>
                  </span>
                  <FaChevronDown className={`text-xs transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoriesOpen && categories.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2">
                    <Link
                      to="/products"
                      onClick={() => {
                        setCategoriesOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm"
                    >
                      Tất cả sản phẩm
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        onClick={() => {
                          setCategoriesOpen(false);
                          setMobileMenuOpen(false);
                        }}
                        className="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                to="/products" 
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quản trị
                </Link>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaUserCircle className="inline mr-2" />
                    Thông tin cá nhân
                  </Link>
                  <Link 
                    to="/orders" 
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FaShoppingBag className="inline mr-2" />
                    Đơn hàng của tôi
                  </Link>
                  <Link 
                    to="/cart" 
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>
                      <FaShoppingCart className="inline mr-2" />
                      Giỏ hàng
                    </span>
                    {cartItemsCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <div className="px-4 py-2 bg-white/10 rounded-lg">
                    <FaUser className="inline mr-2" />
                    {user?.fullName}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-left text-red-400"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

