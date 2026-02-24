import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaTags, FaList, FaStore } from 'react-icons/fa';

const AdminLayout = ({ title, children }) => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Tổng quan', icon: FaTachometerAlt },
    { to: '/admin/products', label: 'Sản phẩm', icon: FaBox },
    { to: '/admin/orders', label: 'Đơn hàng', icon: FaShoppingCart },
    { to: '/admin/promotions', label: 'Khuyến mãi', icon: FaTags },
    { to: '/admin/categories', label: 'Danh mục', icon: FaList },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700">
          <Link to="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Computer Shop</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="mr-2" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <FaStore className="mr-2" />
            <span>Về trang bán hàng</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;


